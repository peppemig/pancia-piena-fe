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
