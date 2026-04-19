export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  is_featured: boolean;
  stock_quantity?: number;
  type?: string;
  room?: string;
  created_at: string;
  categories?: Category;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_name: string;
  email?: string;
  phone: string;
  address: string;
  total_price: number;
  coupon_code?: string | null;
  discount_amount?: number;
  shipping_cost?: number;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name?: string | null;
  product_image_url?: string | null;
  quantity: number;
  price_at_time: number;
  product?: Product;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  is_used: boolean;
  created_at: string;
  used_at?: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}
