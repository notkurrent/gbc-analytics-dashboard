/**
 * Фаза 2 — Загрузка 50 mock-заказов в RetailCRM через API v5.
 *
 * Запуск: npx tsx scripts/upload-to-retailcrm.ts
 *
 * Требования:
 *  - Последовательная отправка с задержкой 250ms (rate limiting)
 *  - Retry 1 раз при HTTP 429/500
 *  - Обработка ошибок: не падаем при одном сбое, продолжаем
 *  - Красивый лог прогресса
 */

import * as dotenv from "dotenv";
import * as fs from "node:fs";
import * as path from "node:path";

// ─── Типы ──────────────────────────────────────────────────────────────────────

interface MockOrderItem {
  productName: string;
  quantity: number;
  initialPrice: number;
}

interface MockOrder {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  orderType: string;
  orderMethod: string;
  status: string;
  items: MockOrderItem[];
  delivery: {
    address: {
      city: string;
      text: string;
    };
  };
  customFields: {
    utm_source: string;
  };
}

interface RetailCrmOrderPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  orderType: string;
  orderMethod: string;
  status: string;
  items: Array<{
    offer: { displayName: string };
    quantity: number;
    initialPrice: number;
  }>;
  delivery: {
    address: {
      city: string;
      text: string;
    };
  };
  customFields: {
    utm_source: string;
  };
}

interface RetailCrmResponse {
  success: boolean;
  id?: number;
  errorMsg?: string;
  errors?: Record<string, string>;
}

// ─── Конфигурация ──────────────────────────────────────────────────────────────

// Загружаем .env.local (стандарт Next.js)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const RETAILCRM_URL = process.env.RETAILCRM_URL;
const RETAILCRM_API_KEY = process.env.RETAILCRM_API_KEY;

const DELAY_MS = 250; // Задержка между запросами (rate limiting)
const MAX_RETRIES = 1; // Максимум 1 повторная попытка при 429/500

// ─── Утилиты ───────────────────────────────────────────────────────────────────

/** Задержка в миллисекундах */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Форматирование суммы: 15000 → "15 000 ₸" */
function formatPrice(amount: number): string {
  return amount.toLocaleString("ru-RU") + " ₸";
}

/** Рассчитывает общую сумму заказа */
function calcOrderTotal(items: MockOrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.initialPrice, 0);
}

// ─── Маппинг Mock → RetailCRM ──────────────────────────────────────────────────

/** Преобразует mock-заказ в формат RetailCRM API */
function mapToRetailCrmOrder(mock: MockOrder): RetailCrmOrderPayload {
  return {
    firstName: mock.firstName,
    lastName: mock.lastName,
    phone: mock.phone,
    email: mock.email,
    orderType: "main", // Forced to 'main' since 'eshop-individual' doesn't exist in current env
    orderMethod: mock.orderMethod,
    status: mock.status,
    items: mock.items.map((item) => ({
      offer: { displayName: item.productName },
      quantity: item.quantity,
      initialPrice: item.initialPrice,
    })),
    delivery: mock.delivery,
    customFields: mock.customFields,
  };
}

// ─── Отправка одного заказа ────────────────────────────────────────────────────

/**
 * Отправляет один заказ в RetailCRM с retry-логикой.
 * При 429 (rate limit) или 500 (server error) — повторяет 1 раз с задержкой.
 */
async function sendOrder(
  order: RetailCrmOrderPayload,
  attempt: number = 0
): Promise<RetailCrmResponse> {
  // Добавляем site=notkurrent как параметр, часто RetailCRM требует указания магазина
  const url = `${RETAILCRM_URL}/api/v5/orders/create?apiKey=${RETAILCRM_API_KEY}&site=notkurrent`;

  const body = new URLSearchParams();
  body.append("order", JSON.stringify(order));

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  // Retry при 429 / 500
  if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
    const retryDelay = response.status === 429 ? 1000 : 500;
    console.log(`   ⏳ Retry через ${retryDelay}ms (HTTP ${response.status})...`);
    await sleep(retryDelay);
    return sendOrder(order, attempt + 1);
  }

  const data = (await response.json()) as RetailCrmResponse;

  if (!response.ok || !data.success) {
    console.error("RAW_ERROR_RESPONSE:", JSON.stringify(data, null, 2));
    const errorMsg = data.errorMsg || JSON.stringify(data.errors) || `HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // Валидация env-переменных
  if (!RETAILCRM_URL || !RETAILCRM_API_KEY) {
    console.error("❌ Ошибка: RETAILCRM_URL и RETAILCRM_API_KEY должны быть заданы в .env.local");
    process.exit(1);
  }

  // Читаем mock-заказы
  const mockPath = path.resolve(process.cwd(), "mock_orders.json");

  if (!fs.existsSync(mockPath)) {
    console.error(`❌ Файл не найден: ${mockPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(mockPath, "utf-8");
  const orders: MockOrder[] = JSON.parse(rawData);

  console.log("═══════════════════════════════════════════════════════");
  console.log(`🚀 Загрузка ${orders.length} заказов в RetailCRM`);
  console.log(`📍 URL: ${RETAILCRM_URL}`);
  console.log("═══════════════════════════════════════════════════════\n");

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < orders.length; i++) {
    const mock = orders[i];
    const index = i + 1;
    const total = calcOrderTotal(mock.items);
    const fullName = `${mock.firstName} ${mock.lastName}`;

    try {
      const retailCrmOrder = mapToRetailCrmOrder(mock);
      const result = await sendOrder(retailCrmOrder);

      console.log(
        `[${String(index).padStart(2, "0")}/${orders.length}] ✅ ${fullName} — ${formatPrice(total)}` +
          (result.id ? ` (ID: ${result.id})` : "")
      );
      successCount++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(
        `[${String(index).padStart(2, "0")}/${orders.length}] ❌ ${fullName} — ${formatPrice(total)} | Ошибка: ${message}`
      );
      errorCount++;
    }

    // Rate limiting: ждём между запросами (кроме последнего)
    if (i < orders.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Итоговый отчёт
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("📊 Результат:");
  console.log(`   ✅ Успешно: ${successCount}`);
  if (errorCount > 0) {
    console.log(`   ❌ Ошибки:  ${errorCount}`);
  }
  console.log(`   📦 Всего:   ${orders.length}`);
  console.log("═══════════════════════════════════════════════════════");

  // Exit code ≠ 0 если есть ошибки — полезно для CI
  if (errorCount > 0) {
    process.exit(1);
  }
}

main();
