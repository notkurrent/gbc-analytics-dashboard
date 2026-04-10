import { createClient } from "@supabase/supabase-js";
import { sendOrderNotification } from "../src/lib/telegram";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Checking for large orders...");

  // 1. Загрузить заказы из Supabase WHERE total_amount > 50000 и которые еще не отправлены
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id, 
      first_name, 
      last_name, 
      city, 
      total_amount,
      notified,
      order_items (
        product_name
      )
    `)
    .gt("total_amount", 50000)
    .eq("notified", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching orders from Supabase:", error.message);
    process.exit(1);
  }

  if (!orders || orders.length === 0) {
    console.log("No new large orders found.");
    return;
  }

  console.log(`Found ${orders.length} large orders to notify.`);

  for (const order of orders) {
    const fullName = [order.first_name, order.last_name].filter(Boolean).join(" ") || "Новый клиент";
    
    // Получаем названия товаров из order_items
    // @ts-ignore - Supabase types might not perfectly infer the join
    const items = order.order_items?.map((item: any) => item.product_name) || [];

    // 3. Отправить уведомление в Telegram
    console.log(`Sending notification for order #${order.id} (${fullName}, ${order.total_amount} ₸)...`);
    await sendOrderNotification({
      name: fullName,
      city: order.city || "Не указан",
      amount: order.total_amount,
      items: items,
    });

    // 4. Пометить как notified
    const { error: updateError } = await supabase
      .from("orders")
      .update({ notified: true })
      .eq("id", order.id);

    if (updateError) {
      console.error(`Error updating order #${order.id} status:`, updateError.message);
    } else {
      console.log(`Order #${order.id} marked as notified.`);
    }
  }

  console.log("Finished processing large orders.");
}

main().catch(console.error);
