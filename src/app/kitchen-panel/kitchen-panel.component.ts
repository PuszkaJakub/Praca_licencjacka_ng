import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Order } from '../model/class-templates';

@Component({
  selector: 'app-kitchen-panel',
  imports: [],
  templateUrl: './kitchen-panel.component.html',
  styleUrl: './kitchen-panel.component.scss',
})
export class KitchenPanelComponent {
  constructor(private firebase: FirebaseService) {
    this.orderList = [];
    // this.getOrdersFromServer();
  }

  orderList: Order[] = [];

  async getOrdersFromServer() {
    const data = await this.firebase.fetchDataOrdersKitchen();
    const orders = data.map((element) => {
      return {
        type: element['type'],
        dateDeliver: element['dateDeliver'],
        products: element['products'],
        address: element['address'],
        status: element['status'],
        payment: element['payment'],
      };
    });
    console.log(orders);

    this.orderList = orders;
  }
}
