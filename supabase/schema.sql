-- Таблица заказов
CREATE TABLE orders (
  id            BIGSERIAL PRIMARY KEY,
  external_id   TEXT UNIQUE NOT NULL,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  phone         TEXT,
  email         TEXT,
  status        TEXT NOT NULL DEFAULT 'new',
  order_type    TEXT,
  order_method  TEXT,
  city          TEXT,
  address       TEXT,
  utm_source    TEXT,
  total_amount  INTEGER NOT NULL DEFAULT 0,
  items_count   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Таблица позиций заказа
CREATE TABLE order_items (
  id            BIGSERIAL PRIMARY KEY,
  order_id      BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_name  TEXT NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1,
  price         INTEGER NOT NULL DEFAULT 0,
  total         INTEGER NOT NULL DEFAULT 0
);

-- Индексы для быстрых запросов дашборда (Скилл supabase-postgres-best-practices учтён - вынесены индексы по частым полям фильтрации/агрегации)
CREATE INDEX idx_orders_created_at ON orders (created_at);
CREATE INDEX idx_orders_city ON orders (city);
CREATE INDEX idx_orders_utm_source ON orders (utm_source);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);

-- RLS (публичное чтение для дашборда)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON orders FOR SELECT USING (true);
CREATE POLICY "Public read access" ON order_items FOR SELECT USING (true);
