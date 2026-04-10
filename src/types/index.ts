// Типы для mock_orders.json
export interface MockOrderItem {
  productName: string;
  quantity: number;
  initialPrice: number;
}
export interface MockOrder {
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

// Типы для Supabase таблиц
export interface Order {
  id: number;
  external_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  status: string;
  order_type: string | null;
  order_method: string | null;
  city: string | null;
  address: string | null;
  utm_source: string | null;
  total_amount: number;
  items_count: number;
  created_at: string;
  updated_at: string;
  notified?: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}
