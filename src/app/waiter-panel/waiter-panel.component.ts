import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { MenuPosition, Order, OrderItem } from '../model/class-templates';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-waiter-panel',
  standalone: true,
  imports: [],
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
      import('leaflet').then((L) => {
        this.initMap(L);
      });
    }
  }

  numberOfProducts: number;
  orderTotal: number;
  menuList: MenuPosition[];
  orderTime: Date;
  orderType: string;
  orderPayment: string;
  orderList: OrderItem[];
  orderAddress: string;
  addressToSearch: string;
  mapShow: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private firebase: FirebaseService
  ) {
    this.numberOfProducts = 0;
    this.orderTotal = 0;
    const pizzaList = this.getMenuFromServer();
    this.menuList = [];
    this.orderTime = new Date();
    this.orderType = 'Sala';
    this.orderPayment = '';
    this.orderList = [];
    this.orderAddress = 'Sala';
    this.addressToSearch = '';
    this.mapShow = false;
  }
  private map: any;

  // Leaflet map
  private initMap(L: typeof import('leaflet')): void {
    this.map = L.map('map', {
      center: [this.routeInfo[2], this.routeInfo[3]],
      zoom: 20,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    const marker = L.marker([this.routeInfo[2], this.routeInfo[3]]).addTo(
      this.map
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
      name: a.innerHTML,
      price: price,
      inEdit: false,
    });
  }

  onOrderTypeChange(event: Event) {
    this.orderType = (event.target as HTMLInputElement).value;
    if(this.orderType === 'Sala'){
      this.orderAddress = 'Sala'
    }
    else if(this.orderType === 'Odbior'){
      this.orderAddress = 'Odbior'
    }
  }

  onOrderPaymentChange(event: Event) {
    this.orderPayment = (event.target as HTMLInputElement).value;
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

  editOrderItem(event: Event, index: number) {
    event.preventDefault();
    const eventForm = event.target as HTMLFormElement;
    this.orderList[index].name = (
      eventForm.elements[0] as HTMLInputElement
    ).value;
    this.orderList[index].price = parseFloat(
      (eventForm.elements[1] as HTMLInputElement).value
    );
  }

  clearOrder() {
    this.orderList = [];
  }

  sendOrder() {
    let newOrderProducts: string = '';
    this.orderList.forEach((product) => {
      newOrderProducts += product.name.trim();
      newOrderProducts += '\n';
    });
    const newOrder = {
      type: this.orderType,
      dateDeliver: this.orderTime,
      products: newOrderProducts,
      address: this.orderAddress,
      status: 'Kuchnia',
      payment: this.orderPayment,
    };
    this.firebase.addDataOrder(newOrder);
  }

  addExtraItemToOrder(inputExtra: HTMLInputElement) {
    const price: number = parseFloat(inputExtra.value);
    if (!isNaN(price) && price != 0) {
      this.orderList.push({ name: 'Inne', price: price, inEdit: false });
    } else {
      alert('Wprowadź wartość');
    }
  }

  searchLocalisation() {
    if (this.addressToSearch !== null && this.addressToSearch !== '') {
      this.searchAddress.emit(this.addressToSearch);
    } else {
      alert('Pole nie może być puste');
    }
  }

  onAddressInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.addressToSearch = value;
  }

  onTimeInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const timeValue = inputElement.value;

    const [hours, minutes] = timeValue.split(':').map(Number);
    this.orderTime.setHours(hours);
    this.orderTime.setMinutes(minutes);
    this.orderTime.setSeconds(0);
    this.orderTime.setMilliseconds(0);
  }

  addDelivery() {
    const deliveryPrice = (this.routeInfo[0] / 1000) * 3;
    this.orderList.push({
      name: `Dostawa - ${this.addressToSearch}`,
      price: Math.round(this.routeInfo[0] / 1000) * 3,
      inEdit: false,
    });
    this.orderAddress = this.addressToSearch;
    this.addressToSearch = '';
    this.mapShow = false;
  }

  async getMenuFromServer() {
    const data = await this.firebase.fetchDataMenu();
    const menu = data.map((element) => {
      return {
        name: element['name'],
        number: element['number'],
        category: element['category'],
        price: element['price'],
      };
    });
    this.menuList = menu;
  }
}
