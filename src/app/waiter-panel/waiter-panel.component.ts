import { Component, Output, EventEmitter, Input } from '@angular/core';;
import { FirebaseService } from '../firebase.service';
import { IMenuPosition, IOrder, IOrderItem } from '../model/class-templates';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import * as L from 'leaflet';

import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-waiter-panel',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './waiter-panel.component.html',
  styleUrl: './waiter-panel.component.scss',
})
export class WaiterPanelComponent {
  @Output() searchAddress = new EventEmitter<string>();

  private _routeInfo: number[] = [];
  public get routeInfo(): number[] {
    return this._routeInfo;
  }
  @Input()
  public set routeInfo(value: number[]) {
    this._routeInfo = value;

    if (value.length) {
      this.mapShow = true;
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }
  }

  orderID: string = '';
  orderTotal: number;
  menuList: IMenuPosition[];
  orderList: IOrderItem[];
  mapShow: boolean;
  map: any;

  constructor(
    private firebase: FirebaseService
  ) {
    this.getMenuFromServer();
    this.orderTotal = 0;
    this.menuList = [];
    this.orderList = [];
    this.mapShow = false;
  }

  orderForm = new FormGroup({
    type: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    address: new FormControl(''),
    payment: new FormControl('', [Validators.required]),
  });

  editItemForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
  });

  extraItemForm = new FormGroup({
    price: new FormControl('', [Validators.required]),
  });

  private initializeMap() {
    const mymap = L.map('leafletmap').setView(
      [this.routeInfo[2], this.routeInfo[3]],
      18
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mymap);

    const marker = L.marker([this.routeInfo[2], this.routeInfo[3]]).addTo(
      mymap
    );
    marker
      .bindPopup(
        `Odległość: ${(this.routeInfo[0] / 1000).toFixed(
          2
        )} km, czas dojazdu: ${Math.ceil(this.routeInfo[1] / 60000)} min`
      )
      .openPopup();
  }

  // export interface IMenuPosition {
  //   name: string;
  //   number: number;
  //   category: string;
  //   price: number;
  // }

  addItemToOrder(flag: string, index?: number) {
    if (flag === 'Menu' && index) {
      this.addMenuItem(index);
      alert('Dodano produkt z menu do listy zamówienia');
    } else if (flag === 'Extra') {
      this.addExtraItem();
      alert('Dodano inny produkt do listy zamówienia');
    } else if (flag === 'Delivery') {
      this.addDelivery();
      alert('Dodano dostawę do listy zamówienia');
    } else {
      alert('Nie udało się dodać produktu listy zamówienia');
    }
  }

  addMenuItem(index: number) {
    if (index >= 0 && index <= this.menuList.length) {
      this.orderList.push({
        name: this.menuList[index].number + ' ' + this.menuList[index].name,
        price: this.menuList[index].price,
        inEdit: false,
        type: this.menuList[index].category,
      });
    }
  }

  addExtraItem() {
    const price: number = parseInt(
      String(this.extraItemForm.get('price')?.value)
    );
    this.orderList.push({
      name: 'Inne',
      price: price,
      inEdit: false,
      type: 'Extra',
    });
  }

  addDelivery(){
      this.orderList.push({
        name: `Dostawa - ${this.orderForm.get('address')?.value}`,
        price: Math.round(this.routeInfo[0] / 1000) * 3,
        inEdit: false,
        type: 'Delivery',
      });
      this.mapShow = false;
  }

  getOrderTotal() {
    let price = 0;
    for (const orderItem of this.orderList) {
      price += orderItem.price;
    }
    return price;
  }

  removeOrderItem(index: number) {
    this.orderList.splice(index, 1);
  }

  editOrderItemStart(index: number) {
    this.editItemForm.setValue({
      name: String(this.orderList[index].name),
      price: String(this.orderList[index].price),
    });
  }

  editOrderItemSet(index: number) {
    this.orderList[index].name = String(this.editItemForm.get('name')?.value);
    this.orderList[index].price = parseInt(
      String(this.editItemForm.get('price')?.value)
    );
  }

  clearOrder() {
    this.orderList = [];
  }

  sendOrder() {
    if (
      String(this.orderForm.get('type')?.value) === 'Dostawa' &&
      !this.orderList.some((item) => item.type === 'Delivery')
    ) {
      alert('Wybrano dostawę, ale nie znajduje się w zamówieniu');
      return;
    }

    let orderTime = new Date();
    const timeValue = String(this.orderForm.get('time')?.value);
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      orderTime.setHours(hours);
      orderTime.setMinutes(minutes);
      orderTime.setSeconds(0);
      orderTime.setMilliseconds(0);
    }

    let newOrderProducts: string[] = [];
    this.orderList.forEach((product) => {
      newOrderProducts.push(product.name.trim());
    });

    const newOrder = {
      id: this.orderID,
      type: String(this.orderForm.get('type')?.value),
      dateDeliver: Timestamp.fromDate(orderTime),
      products: newOrderProducts,
      address: String(this.orderForm.get('address')?.value),
      status: 'Kuchnia',
      payment: String(this.orderForm.get('payment')?.value),
    };

    this.firebase.addDataOrder(newOrder);
    this.orderForm.reset();
    this.clearOrder();
  }

  searchLocalisation() {
    const addressToSearch = String(this.orderForm.get('address')?.value);
    if (addressToSearch !== null && addressToSearch !== '') {
      this.searchAddress.emit(addressToSearch);
    } else {
      alert('Pole nie może być puste');
    }
  }

  async getMenuFromServer() {
    const data = await this.firebase.fetchDataMenu();
    this.menuList = data;
  }

  isDelivery(): Boolean {
    return String(this.orderForm.get('type')?.value) === 'Dostawa';
  }

  fillOrderToEdit(order: IOrder) {
    this.orderID = order.id;
    this.orderForm.get('type')?.patchValue(order.type);
    const time = order.dateDeliver.toDate().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    this.orderForm.get('time')?.patchValue(time);
    this.orderForm.get('address')?.patchValue(order.address);
    this.orderForm.get('payment')?.patchValue(order.payment);
    if (order.type === 'Dostawa') {
      this.searchLocalisation();
    }

    this.clearOrder();
    for (let product of order.products) {
      console.log(product.split(' ')[0]);
      const productNumber = parseFloat(product.split(' ')[0]);
      const menuItem = this.menuList.find(
        (item) => item.number == productNumber
      );
      if (menuItem) {
        console.log(menuItem);
        this.orderList.push({
          name: product,
          price: menuItem.price,
          inEdit: false,
          type: menuItem.category,
        });
      }
    }
  }
}
