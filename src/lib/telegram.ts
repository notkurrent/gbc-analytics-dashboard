import { Bot } from "grammy";
import { formatCurrency } from "./utils";

export async function sendOrderNotification(order: { name: string; city: string; amount: number; items: any[] }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.");
    return;
  }

  const bot = new Bot(token);

  const formattedItems = order.items.map((i) => {
    if (typeof i === "string") return i;
    if (i && typeof i === "object") {
      const name = i.name || i.productName || i.offer?.displayName || "Неизвестный товар";
      const qty = i.quantity ? ` (${i.quantity} шт.)` : "";
      return `${name}${qty}`;
    }
    return "Неизвестный товар";
  });

  const message = `
🔔 *Крупный заказ!*
👤 ${order.name}
📍 ${order.city || "Не указан"}
💰 ${formatCurrency(order.amount)}
📦 Товары:
${formattedItems.length > 0 ? formattedItems.map((i) => `  • ${i}`).join("\n") : "  • Нет данных"}
  `.trim();

  try {
    await bot.api.sendMessage(chatId, message, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error sending order notification to Telegram via grammY:", error);
  }
}
