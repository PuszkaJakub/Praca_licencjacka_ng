import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { IOrder } from '../model/class-templates';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { OrderComponent } from './order/order.component';

@Component({
  selector: 'app-kitchen-panel',
  imports: [ReactiveFormsModule, OrderComponent],
  templateUrl: './kitchen-panel.component.html',
  styleUrl: './kitchen-panel.component.scss',
})
export class KitchenPanelComponent {
  @Output() editOrderEmitter = new EventEmitter<IOrder>();

  orderList: IOrder[] = [];

  filterForm = new FormGroup({
    filter: new FormControl('Kuchnia', [Validators.required]),
  });

  constructor(private firebase: FirebaseService) {
    this.getOrdersFromServer();
  }

  editOrder(index: number) {
    this.editOrderEmitter.emit(this.orderList[index]);
  }

  async getOrdersFromServer() {
    await this.firebase.deleteOldOrders();
    this.orderList = await this.firebase.fetchDataOrdersKitchen(
      String(this.filterForm.get('filter')?.value)
    );
  }

  async changeOrderStatus(index: number) {
    let status = 'Gotowe';
    if (this.orderList[index].status === 'Gotowe') {
      status = 'Kuchnia';
    }
    await this.firebase.setOrderStatus(this.orderList[index].id, status);
    await this.getOrdersFromServer();
  }
}
