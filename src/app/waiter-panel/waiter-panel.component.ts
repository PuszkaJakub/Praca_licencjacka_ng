import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { MenuPosition, Order, OrderItem } from '../model/class-templates';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import * as L from 'leaflet';

//TODO - usunac pipe
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-waiter-panel',
  standalone: true,
  //TODO - usunac pipe
  imports: [ReactiveFormsModule, JsonPipe],
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
        this.initialize();
      }, 100);
    }
  }

  orderTotal: number;
  menuList: MenuPosition[];
  orderList: OrderItem[];
  mapShow: boolean;
  map: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private firebase: FirebaseService
  ) {
    this.orderTotal = 0;
    const pizzaList = this.getMenuFromServer();
    this.menuList = [];
    this.orderList = [];
    this.mapShow = false;
  }

  orderForm = new FormGroup({
    type: new FormControl('Sala', [Validators.required]),
    time: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    payment: new FormControl('Karta', [Validators.required]),
  });

  editItemForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
  })

  extraItemForm = new FormGroup({
    price: new FormControl('', [Validators.required]),
  })

  private initialize() {
    const options: L.MapOptions = {
      center: L.latLng([this.routeInfo[2], this.routeInfo[3]]),
      zoom: 18,
    };
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

  addItemToOrder(event: Event) {
    const a = event.target as HTMLElement;
    const dataPrice = a.getAttribute('data-price');
    const price = dataPrice ? parseInt(dataPrice) : 0;
    this.orderList.push({
      name: a.innerText,
      price: price,
      inEdit: false,
    });
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
    this.editItemForm.setValue({name: String(this.orderList[index].name), price: String(this.orderList[index].price)})
  }

  editOrderItemSet(index: number) {
    this.orderList[index].name = String(this.editItemForm.get('name')?.value);
    this.orderList[index].price = parseInt(String(this.editItemForm.get('price')?.value));
  }

  clearOrder() {
    this.orderList = [];
  }

  sendOrder() {
    let orderTime = new Date();
    const timeValue = String(this.orderForm.get('time')?.value);
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      orderTime.setHours(hours);
      orderTime.setMinutes(minutes);
      orderTime.setSeconds(0);
      orderTime.setMilliseconds(0);
    }

    let newOrderProducts: string = '';
    this.orderList.forEach((product) => {
      newOrderProducts += product.name.trim();
      newOrderProducts += '\n';
    });

    const newOrder = {
      id: '',
      type: String(this.orderForm.get('type')?.value),
      dateDeliver: orderTime,
      products: newOrderProducts,
      address: String(this.orderForm.get('address')?.value),
      status: 'Kuchnia',
      payment: String(this.orderForm.get('payment')?.value),
    };
    this.firebase.addDataOrder(newOrder);
  }
  addExtraItemToOrder() {
    const price: number = parseInt(String(this.extraItemForm.get('price')?.value));
    if (!isNaN(price) && price != 0) {
      this.orderList.push({ name: 'Inne', price: price, inEdit: false });
    } else {
      alert('Wprowadź wartość');
    }
  }

  searchLocalisation() {
    const addressToSearch = String(this.orderForm.get('address')?.value);
    if (addressToSearch !== null && addressToSearch !== '') {
      this.searchAddress.emit(addressToSearch);
    } else {
      alert('Pole nie może być puste');
    }
  }

  addDelivery() {
    const deliveryPrice = (this.routeInfo[0] / 1000) * 3;
    this.orderList.push({
      name: `Dostawa - ${this.orderForm.get('address')?.value}`,
      price: Math.round(this.routeInfo[0] / 1000) * 3,
      inEdit: false,
    });
    this.mapShow = false;
  }

  async getMenuFromServer() {
    const data = await this.firebase.fetchDataMenu();
    this.menuList = data;
  }

  isDelivery(): Boolean {
    return String(this.orderForm.get('type')?.value) === 'Dostawa';
  }
}
