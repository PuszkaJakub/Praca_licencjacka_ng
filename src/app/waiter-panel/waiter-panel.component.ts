import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { IMenuPosition, IOrder, IOrderItem } from '../model/class-templates';
// import {
//   ReactiveFormsModule,
//   FormGroup,
//   FormControl,
//   Validators,
// } from '@angular/forms';
// import * as L from 'leaflet';

// import { Timestamp } from 'firebase/firestore';
import { MenuComponent } from './menu/menu.component';
import { OrderFormComponent } from './order-form/order-form.component';

@Component({
  selector: 'app-waiter-panel',
  standalone: true,
  imports: [MenuComponent, OrderFormComponent],
  templateUrl: './waiter-panel.component.html',
  styleUrl: './waiter-panel.component.scss',
})
export class WaiterPanelComponent {
  @Output() searchAddress = new EventEmitter<string>();
  @ViewChild(MenuComponent) menuComponent!: MenuComponent;
  @ViewChild(OrderFormComponent) orderFormComponent!: OrderFormComponent;

  private _routeInfo: number[] = [];
  public get routeInfo(): number[] {
    return this._routeInfo;
  }
  @Input()
  public set routeInfo(value: number[]) {
    this._routeInfo = value;
  }

  menuList: IMenuPosition[] = [];
  orderList: IOrderItem[] = [];
  mapShow: boolean = false;
  map: any;

  constructor(private firebase: FirebaseService) {
    this.getMenuFromServer();
  }


  addItemToOrder(item: IOrderItem) {
    this.orderList.push(item);
  }

  getOrderTotal() {
    let price = 0;
    this.orderList.forEach((item) => {
      price += item.price;
    });
    return price;
  }

  removeOrderItem(index: number) {
    this.orderList.splice(index, 1);
  }

  clearOrder() {
    this.orderList = [];
  }

  sendOrder(order: IOrder) {
    this.firebase.addDataOrder(order);
    this.orderList = [];
  }

  searchLocalisation(address: string) {
    this.searchAddress.emit(address);
  }

  async getMenuFromServer() {
    const data = await this.firebase.fetchDataMenu();
    this.menuList = data;
  }

  fillOrderToEdit(order: IOrder) {
    this.menuComponent.fillOrderList(order.products);
    this.orderFormComponent.fillOrderForm(order);
  }
}
