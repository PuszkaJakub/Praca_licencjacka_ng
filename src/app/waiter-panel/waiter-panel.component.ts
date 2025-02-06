import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FirebaseService } from '../firebase.service';
import { MenuPosition, OrderItem } from '../model/class-templates'


@Component({
  selector: 'app-waiter-panel',
  standalone: true,
  imports: [AsyncPipe],
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
    // const pizzaList = this.getMenuFromServer();
    this.menuList = [];
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
    this.orderList.push(new OrderItem(a.innerHTML, price));
  }

  onOrderTypeChange(event: Event) {
    this.orderType = (event.target as HTMLInputElement).value;
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

  sendOrder(){

    // type: string,
    // dateDeliver: string,
    // dateOrder: string,
    // products: string[],
    // address: string,
    // status: string,
    // payment: string

    console.log(this.orderType)
    console.log()
    console.log()
    console.log(this.orderList)
    console.log(this.orderAddress)
    console.log("kuchnia")
    console.log(this.orderPayment)
  }

  addExtraItemToOrder(inputExtra: HTMLInputElement) {
    const price: number = parseFloat(inputExtra.value);
    if (!isNaN(price) && price != 0) {
      this.orderList.push(new OrderItem('Inne', price));
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

  addDelivery() {
    const deliveryPrice = (this.routeInfo[0] / 1000) * 3;
    this.orderList.push(
      new OrderItem(
        `Dostawa - ${this.addressToSearch}`,
        Math.round(this.routeInfo[0] / 1000) * 3
      )
    );
    this.orderAddress = this.addressToSearch;
    this.addressToSearch = '';
    this.mapShow = false;
  }

  async getMenuFromServer() {
    const data = await this.firebase.fetchDataMenu();
    const menu = data.map((element) => {
      return new MenuPosition(
        element['name'],
        element['number'],
        element['category'],
        element['price']
      );
    });
    console.log(menu);

    this.menuList = menu;
  }
}
