import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { IOrder } from '../model/class-templates';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-kitchen-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './kitchen-panel.component.html',
  styleUrl: './kitchen-panel.component.scss',
})
export class KitchenPanelComponent {
  @Output() editOrderEmitter = new EventEmitter<IOrder>();
  // @Input() orderList: IOrder[] = [];
  
  orderList: IOrder[] = [];
  editID: number = -1;
  
  filterForm = new FormGroup({
    filter: new FormControl('Kuchnia', [Validators.required]),
  });

  

  constructor(private firebase: FirebaseService) {
    this.getOrdersFromServer();
  }

  editOrder(index: number) {

    alert("Edycja zamówienia\nZostaniesz przekierowany do panelu kelnera");
    this.editOrderEmitter.emit(this.orderList[index]);
  }

  async getOrdersFromServer() {
    await this.firebase.deleteOldOrders();
    this.orderList = await this.firebase.fetchDataOrdersKitchen(
      String(this.filterForm.get('filter')?.value)
    );

    // this.orderList = orders;
  }

  async changeOrderStatus(index: number) {
    let status = 'Gotowe';
    if (this.orderList[index].status === 'Gotowe') {
      status = 'Kuchnia';
    }
    await this.firebase.setOrderStatus(this.orderList[index].id, status);
    this.getOrdersFromServer();
  }

  orderGetTime(time: Timestamp){
    return time?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}
