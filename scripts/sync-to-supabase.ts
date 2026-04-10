/**
 * Фаза 3 — Синхронизация заказов из RetailCRM в Supabase.
 *
 * Запуск: npx tsx scripts/sync-to-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "node:path";

// Загружаем .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const RETAILCRM_URL = process.env.RETAILCRM_URL;
const RETAILCRM_API_KEY = process.env.RETAILCRM_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ─── Типы RetailCRM ────────────────────────────────────────────────────────────
interface RetailCrmOrder {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  status?: string;
  orderType?: string;
  orderMethod?: string;
  delivery?: {
    address?: {
      city?: string;
      text?: string;
    };
  };
  customFields?: {
    utm_source?: string;
  };
  items?: Array<{
    offer?: { displayName?: string };
    quantity: number;
    initialPrice: number;
  }>;
  createdAt?: string;
}

interface RetailCrmOrdersResponse {
  success: boolean;
  pagination: {
    limit: number;
    totalCount: number;
    currentPage: number;
    totalPageCount: number;
  };
  orders: RetailCrmOrder[];
  errorMsg?: string;
}

// ─── Утилиты ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!RETAILCRM_URL || !RETAILCRM_API_KEY) {
    console.error("❌ Ошибка: RETAILCRM_URL и RETAILCRM_API_KEY не заданы.");
    process.exit(1);
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("❌ Ошибка: NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY не заданы.");
    process.exit(1);
  }

  // Создаем Service Role клиент для обхода RLS (серверные операции)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  console.log("═══════════════════════════════════════════════════════");
  console.log("🚀 Начало синхронизации RetailCRM → Supabase");
  console.log("═══════════════════════════════════════════════════════\n");

  let currentPage = 1;
  let totalPages = 1;
  let successCount = 0;
  let errorCount = 0;

  do {
    const url = `${RETAILCRM_URL}/api/v5/orders?apiKey=${RETAILCRM_API_KEY}&limit=100&page=${currentPage}`;
    console.log(`📡 Загрузка страницы ${currentPage}...`);

    let response: Response;
    try {
      response = await fetch(url);
    } catch (err) {
      console.error(`❌ Ошибка сети: ${err}`);
      break;
    }

    if (response.status === 429) {
      console.log("⏳ Rate limit. Ждём 1 секунду...");
      await sleep(1000);
      continue;
    }

    const data = (await response.json()) as RetailCrmOrdersResponse;

    if (!response.ok || !data.success) {
      console.error("❌ Возникла ошибка при получении заказов:", data.errorMsg);
      break;
    }

    totalPages = data.pagination.totalPageCount;

    for (const order of data.orders) {
      try {
        const totalAmount = (order.items || []).reduce(
          (sum, item) => sum + item.quantity * item.initialPrice,
          0
        );
        const itemsCount = (order.items || []).reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        // 1. Upsert в таблицу orders
        const { data: insertedOrder, error: orderError } = await supabase
          .from("orders")
          .upsert(
            {
              external_id: String(order.id),
              first_name: order.firstName || "Неизвестно",
              last_name: order.lastName || "-",
              phone: order.phone || null,
              email: order.email || null,
              status: order.status || "new",
              order_type: order.orderType || null,
              order_method: order.orderMethod || null,
              city: order.delivery?.address?.city || null,
              address: order.delivery?.address?.text || null,
              utm_source: order.customFields?.utm_source || null,
              total_amount: totalAmount,
              items_count: itemsCount,
              created_at: order.createdAt || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "external_id", ignoreDuplicates: false }
          )
          .select("id")
          .single();

        if (orderError) {
          throw new Error(`Ошибка при вставке заказа ${order.id}: ${orderError.message}`);
        }

        // 2. Вставка order_items
        if (insertedOrder && order.items && order.items.length > 0) {
          // Удаляем старые items перед загрузкой новых
          await supabase.from("order_items").delete().eq("order_id", insertedOrder.id);

          const itemsToInsert = order.items.map((item) => ({
            order_id: insertedOrder.id,
            product_name: item.offer?.displayName || "Неизвестный товар",
            quantity: item.quantity,
            price: item.initialPrice,
            total: item.quantity * item.initialPrice,
          }));

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(itemsToInsert);

          if (itemsError) {
            throw new Error(`Ошибка при вставке позиций ${order.id}: ${itemsError.message}`);
          }
        }

        console.log(`   ✅ Заказ #${order.id} синхронизирован (${itemsCount} товаров).`);
        successCount++;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Заказ #${order.id} пропущен: ${message}`);
        errorCount++;
      }
    }

    currentPage++;
  } while (currentPage <= totalPages);

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("📊 Результат синхронизации:");
  console.log(`   ✅ Успешно синхронизировано: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Ошибок:  ${errorCount}`);
  }
  console.log("═══════════════════════════════════════════════════════");
}

main();
