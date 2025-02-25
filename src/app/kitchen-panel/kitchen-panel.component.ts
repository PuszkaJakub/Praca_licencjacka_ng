import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Order } from '../model/class-templates';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-kitchen-panel',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './kitchen-panel.component.html',
  styleUrl: './kitchen-panel.component.scss',
})
export class KitchenPanelComponent {
  orderList: Order[] = [];

  filterForm = new FormGroup({
    filter: new FormControl('Kuchnia', [Validators.required]),
  })


  constructor(private firebase: FirebaseService) {
    this.getOrdersFromServer();
    
  }


  async getOrdersFromServer() {
    const orders = await this.firebase.fetchDataOrdersKitchen(String(this.filterForm.get('filter')?.value));
    
    this.orderList = orders;
    console.log(this.orderList)
  }

  async changeOrderStatus(orderID: string, index: number){
    console.log(index)
    let status = 'Gotowe'
    if(this.orderList[index].status === 'Gotowe'){
      status = 'Kuchnia'
    }
    await this.firebase.setOrderStatus(orderID, status);
    this.getOrdersFromServer();
  }
}
