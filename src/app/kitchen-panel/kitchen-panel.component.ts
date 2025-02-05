import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

class Order {
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

  // <p>{{orderItem.type}}</p>
  // <p>{{orderItem.dateDeliver}}</p>
  // <p>{{orderItem.products}}</p>
  // <p>{{orderItem.address}}</p>
}

@Component({
  selector: 'app-kitchen-panel',
  imports: [],
  templateUrl: './kitchen-panel.component.html',
  styleUrl: './kitchen-panel.component.scss',
})
export class KitchenPanelComponent {

  constructor(private firebase: FirebaseService){
    this.orderList = [];
    // this.getOrdersFromServer();

  }

  orderList: Order[] = [];

  async getOrdersFromServer() {
    const data = await this.firebase.fetchDataOrdersKitchen();
    const orders = data.map((element) => {
      return new Order(
        element['type'],
        element['dateDeliver'],
        element['dateOrder'],
        element['products'],
        element['address'],
        element['status'],
        element['payment']
      );
    });
    console.log(orders);

    this.orderList = orders;

  }
}
