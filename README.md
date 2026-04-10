# GBC Analytics Dashboard

## 🎯 Описание

Мини-дашборд аналитики заказов, реализованный в рамках тестового задания. Дашборд отображает KPI метрики, графики продаж (по времени, городам и источникам) и последние заказы.

**Основные фичи:**

- 🔄 Интеграция с RetailCRM API (синхронизация заказов)
- 💾 PostgreSQL база данных (через Supabase)
- 🤖 Уведомления о крупных заказах (>50,000 ₸) в Telegram (через вебхуки)
- 🌙 Элегантный тёмный UI с микро-анимациями (shadcn/ui + Recharts)

## 🛠 Технологии

- **Frontend/Backend:** Next.js 16 (App Router), TypeScript
- **UI:** Tailwind CSS, shadcn/ui
- **Charts:** Recharts (встроен в shadcn)
- **База данных:** Supabase (поверх PostgreSQL)
- **Уведомления:** Telegram Bot API
- **Деплой:** Vercel

## 🚀 Как запустить локально

1. **Клонируйте репозиторий:**

   ```bash
   git clone <url_репозитория>
   cd gbc-analytics-dashboard
   ```

2. **Установите зависимости:**

   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**
   - Скопируйте `.env.example` в `.env.local`
   - Заполните ключи доступа к RetailCRM, Supabase и Telegram.

   ```bash
   cp .env.example .env.local
   ```

4. **Запустите проект:**
   ```bash
   npm run dev
   ```

## 📦 Скрипты (Фазы 2 и 3)

Проект содержит утилиты для быстрой загрузки данных:

- `npx tsx scripts/upload-to-retailcrm.ts` — парсит `mock_orders.json` и отправляет 50 заказов в RetailCRM по API v5.
- `npx tsx scripts/sync-to-supabase.ts` — забирает заказы из RetailCRM и синхронизирует их с БД Supabase (разбивая на `orders` и `order_items`).
- `npx tsx scripts/check-large-orders.ts` — fallback-скрипт для ручной проверки крупных заказов и отправки их в Telegram (помечает флаг `notified = true`).

## 🔔 Webhook (Фаза 5)

На продакшене (Vercel) развернут защищенный эндпоинт для приема вебхуков от RetailCRM (срабатывает при заказах от 50 000 ₸).

Поскольку на тестовых тарифах RetailCRM функция исходящих вебхуков может быть отключена, вы можете протестировать этот эндпоинт отправкой `POST` запроса:

```bash
curl -X POST https://gbc-analytics-dashboard-eta.vercel.app/api/webhook/retailcrm \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your_random_secret",
    "order": {
      "amount": 75000,
      "name": "Тестовый Покупатель",
      "city": "Алматы",
      "items": [{"name": "Гантели", "quantity": 1}]
    }
  }'
```

**(Убедитесь, что ваш `WEBHOOK_SECRET` совпадает с переменной на Vercel).**

## 🤖 Процесс разработки с AI (Фаза 6)

Проект был реализован с помощью AI-ассистента с использованием разбиения на изолированные фазы (Phased Architecture).

- Использованные навыки (skills): `frontend-design`, `vercel-react-best-practices`, `supabase-postgres-best-practices`
- Был составлен детальный 6-этапный план, где каждый этап реализовывался независимо.

**Какие промпты я давал (примеры):**

1. _"Сделай Фазу 1 по плану: инициализируй проект Next.js 15, установи shadcn/ui и настрой Supabase-клиентов."_
2. _"Переходим к Фазе 2: напиши скрипт загрузки `mock_orders.json` в RetailCRM API."_
3. _"Фаза 4: Сгенерируй дашборд с использованием Recharts. Выведи `OrdersChart`, `RevenueChart` и остальные компоненты."_
4. _"У меня проблема с горизонтальным скроллом на мобилках и пропаданием графиков. Исправь перерисовки GPU и убери размытия фона."_

**Где застрял и как решил:**

1. **Проблема:** исчезновение блоков дашборда на мобильных устройствах (iOS Safari) при скролле.
   **Решение:** Выяснили, что это лимиты GPU Tiling. Исправили добавлением `transform-gpu` к карточкам, отключили дорогие эффекты `blur` на мобильных экранах и разделили общую анимацию на секции.
2. **Проблема:** Различная структура данных в локальном JSON, RetailCRM и реляционной таблице Supabase.
   **Решение:** Написаны утилитарные скрипты для маппинга и синхронизации (`upload-to-retailcrm.ts`, `sync-to-supabase.ts`).
3. **Проблема:** RetailCRM демо-аккаунт иногда сильно ограничивает вебхуки (или их нельзя создать).
   **Решение:** Написан fallback-скрипт `scripts/check-large-orders.ts`, который работает по принципу поллинга (через крон / запуск вручную), проверяя новые заказы в таблице `orders` на > 50,000 ₸.

## 🔗 Ссылки

- **Дашборд (Vercel):** [gbc-analytics-dashboard-eta.vercel.app](https://gbc-analytics-dashboard-eta.vercel.app)
- **Репозиторий:** [github.com/notkurrent/gbc-analytics-dashboard](https://github.com/notkurrent/gbc-analytics-dashboard)
