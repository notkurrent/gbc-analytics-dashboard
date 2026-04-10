import { NextResponse } from "next/server";
import { sendOrderNotification } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Верификация запроса (WEBHOOK_SECRET)
    if (body.secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { order } = body;

    // 2. Проверка данных
    if (!order || typeof order.amount !== "number") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 4. Если > 50,000 ₸ → sendOrderNotification()
    if (order.amount > 50000) {
      await sendOrderNotification({
        name: order.name,
        city: order.city,
        amount: order.amount,
        items: order.items || [],
      });
    }

    // 5. Return 200 OK
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook parse error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
