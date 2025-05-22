import { Timestamp } from "firebase/firestore";

export interface IMenuPosition {
  name: string;
  number: number;
  category: string;
  price: number;
}

export interface IOrderItem {
  name: string;
  price: number;
  inEdit: boolean;
  type: string;
}

export interface IOrder {
    id: string;
    type: string;
    dateDeliver: Timestamp;
    products: string[];
    address: string;
    status: string;
    payment: string;
  }
