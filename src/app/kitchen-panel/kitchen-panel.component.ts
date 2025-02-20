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
  orderList: Order[] = [];

  constructor(private firebase: FirebaseService) {
    this.getOrdersFromServer();
  }


  async getOrdersFromServer() {
    const orders = await this.firebase.fetchDataOrdersKitchen();
    
    this.orderList = orders;
  }

  async setOrderReady(orderID: string){
    await this.firebase.setOrderDone(orderID);
    this.getOrdersFromServer();
  }
}
