import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IOrder } from '../../model/class-templates';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: '../kitchen-panel.component.scss',
})
export class OrderComponent {
  @Input() order: IOrder = {
    id: '',
    type: '',
    dateDeliver: Timestamp.now(),
    products: [],
    address: '',
    status: '',
    payment: '',
  };
  @Output() callEditOrder = new EventEmitter();
  @Output() callChangeStatus = new EventEmitter();

  constructor() {}

  orderGetTime(time: Timestamp) {
    return time
      ?.toDate()
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  sendEditRequest() {
    this.callEditOrder.emit();
  }

  sendChangeStatusRequest() {
    this.callChangeStatus.emit();
  }
}
