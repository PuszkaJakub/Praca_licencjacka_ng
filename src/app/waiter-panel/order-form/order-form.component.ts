import { Component, Output, EventEmitter, Input } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { IMenuPosition, IOrder, IOrderItem } from '../../model/class-templates';
import * as L from 'leaflet';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrl: '../waiter-panel.component.scss',
})
export class OrderFormComponent {
  orderID: string = '';
  menuList: IMenuPosition[] = [];
  mapShow: boolean = false;
  map: any;
  @Input() orderList: IOrderItem[] = [];

  public get routeInfo(): number[] {
    return this._routeInfo;
  }
  private _routeInfo: number[] = [];

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

  @Output() callSearchAddress = new EventEmitter<string>();
  @Output() callAddDelivery = new EventEmitter<IOrderItem>();
  @Output() callRemoveItem = new EventEmitter<number>();
  @Output() callSendOrder = new EventEmitter<IOrder>();

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

  sendAddressSearchRequest() {
    const addressToSearch = String(this.orderForm.get('address')?.value);
    if (addressToSearch !== null && addressToSearch !== '') {
      this.callSearchAddress.emit(addressToSearch);
    } else {
      alert('Pole nie może być puste');
    }
  }

  removeOrderItem(index: number) {
    this.callRemoveItem.emit(index);
  }

  getOrderTotal() {
    return this.orderList.reduce((sum, item) => sum + item.price, 0);
  }

  passDelivery() {
    const deliveryItem: IOrderItem = {
      name: `Dostawa - ${this.orderForm.get('address')?.value}`,
      price: Math.round(this.routeInfo[0] / 1000) * 3,
      inEdit: false,
      type: 'Delivery',
    };
    this.callAddDelivery.emit(deliveryItem);
    this.mapShow = false;
  }

  passOrder() {
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
      let newOrderProducts: string[] = this.orderList.map((product) =>
        product.name.trim()
      );

      const newOrder = {
        id: this.orderID,
        type: String(this.orderForm.get('type')?.value),
        dateDeliver: Timestamp.fromDate(orderTime),
        products: newOrderProducts,
        address: String(this.orderForm.get('address')?.value),
        status: 'Kuchnia',
        payment: String(this.orderForm.get('payment')?.value),
      };

      this.callSendOrder.emit(newOrder);
      this.orderForm.reset();
    }
  }

  fillOrderForm(order: IOrder) {
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
      this.sendAddressSearchRequest();
    }
  }
}
