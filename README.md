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
- `npx tsx scripts/check-large-orders.ts` — fallback-скрипт (если недоступны Webhooks RetailCRM) для проверки крупных заказов и отправки в TG.

## 📊 Демонстрация
*(Добавьте сюда ссылку или скриншоты готового дашборда и скриншот сообщения в Telegram перед отправкой задания)*

## 🤖 Процесс разработки с AI
Проект был реализован с помощью AI-ассистента с использованием разбиения на изолированные фазы (Phased Architecture). 
- Использованные навыки (skills): `frontend-design`, `vercel-react-best-practices`, `supabase-postgres-best-practices`
- Был составлен детальный 6-этапный план, где каждый этап реализовывался независимо.
- Вызовы: маппинг структур данных между локальным JSON, RetailCRM API и реляционной БД Supabase. Успешно решены через написание утилитарных синхронизационных скриптов.

## 🔗 Ссылки
- **Дашборд:** [Укажите ссылку на Vercel]
- **Репозиторий:** [Укажите ссылку на GitHub]
