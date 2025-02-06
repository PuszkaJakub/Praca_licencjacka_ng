export class MenuPosition {
  name: string;
  number: number;
  category: string;
  price: number;

  constructor(name: string, number: number, category: string, price: number) {
    this.name = name;
    this.number = number;
    this.category = category;
    this.price = price;
  }
}

export class OrderItem {
  name: string;
  price: number;
  inEdit: boolean;
  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
    this.inEdit = false;
  }
}

export class Order {
    type: string;
    dateDeliver: string;
    products: string[];
    address: string;
    status: string;
    payment: string;
  
    constructor(
      type: string,
      dateDeliver: string,
      dateOrder: string,
      products: string[],
      address: string,
      status: string,
      payment: string
    ) {
      this.type = type;
      this.dateDeliver = dateDeliver;
      this.products = products;
      this.address = address;
      this.status = status
      this.payment = payment;
    }
  }
