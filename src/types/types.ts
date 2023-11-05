export type Product = {
  id: string;
  name: string;
  price: number;
  userId: string;
  category: Category;
};

export type OrderItem = {
  productId: string;
  quantity: number;
  productName: string;
  productPrice: number;
};

export type Order = {
  id: string;
  tableNumber: number;
  totalPrice: string;
  isCompleted: boolean;
  createdAt: Date;
  userId: string;
  orderItems?: OrderItemResponse[];
};

export type Stats = {
  monthlyStats: { _count: number; _sum: { totalPrice: number } };
  dailyOrders: number;
  last5Orders: Order[];
};

type OrderItemResponse = {
  id: string;
  quantity: number;
  productId: string;
  orderId: string;
  product: Product;
};

export type OrderRequest = {
  tableNumber: number;
  orderItems: OrderItem[];
};

export type ProductRequest = {
  name: string;
  price: number;
  category: Category;
};

export enum Category {
  ANTIPASTO = "ANTIPASTO",
  PRIMO = "PRIMO",
  SECONDO = "SECONDO",
  DOLCE = "DOLCE",
  BEVANDA = "BEVANDA",
}
