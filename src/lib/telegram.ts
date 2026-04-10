import { formatCurrency } from "./utils";

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function sendOrderNotification(order: {
  name: string;
  city: string;
  amount: number;
  items: string[];
}) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.");
    return;
  }

  const message = `
🔔 *Крупный заказ!*
👤 ${order.name}
📍 ${order.city || "Не указан"}
💰 ${formatCurrency(order.amount)}
📦 Товары:
${order.items.length > 0 ? order.items.map(i => `  • ${i}`).join('\n') : "  • Нет данных"}
  `.trim();

  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Failed to send telegram message:", errorData);
    }
  } catch (error) {
    console.error("Error sending order notification to Telegram:", error);
  }
}
