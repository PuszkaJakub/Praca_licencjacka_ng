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
