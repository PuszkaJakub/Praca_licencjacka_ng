export interface MenuPosition {
  name: string;
  number: number;
  category: string;
  price: number;
}

export interface OrderItem {
  name: string;
  price: number;
  inEdit: boolean;
}

export interface Order {
    type: string;
    dateDeliver: Date;
    products: string;
    address: string;
    status: string;
    payment: string;
  }
