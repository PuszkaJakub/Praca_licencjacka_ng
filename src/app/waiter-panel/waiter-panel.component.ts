import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

class Pizza {
  name: string;
  number: number;
  category: string;
  price: number;

  constructor(name: string, number: number, category: string, price: number) {
    this.name = name;
    this.number = number;
    this.category = category;
    this.price = price;
  }
}

class OrderItem {
  name: string;
  price: number;
  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }
}

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
  menuList: Pizza[];
  orderList: OrderItem[];
  addressToSearch: string;
  mapShow: boolean;

  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.numberOfProducts = 0;
    this.orderTotal = 0;
    const pizzaList = this.fetchData();
    this.menuList = [];
    this.orderList = [];
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

  getNumberOfProducts() {
    return this.orderList.length;
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

  editOrderItem(index: number) {}

  items: any[] = [];
  async clearOrder() {
    const ala = collection(this.db, 'Menu' )
    const snap = await getDocs(ala);
    const list = snap.docs.map(doc => doc.data())
    console.log(list)
  }



  addExtraItemToOrder(inputExtra: HTMLInputElement) {
    console.log(inputExtra.value);
    const price: number = parseFloat(inputExtra.value);
    if (!isNaN(price) && price != 0) {
      this.orderList.push(new OrderItem('Inne', price));
      inputExtra.value = 'Inne';
    } else {
      alert('Wprowadź wartość');
    }
  }

  searchLocalisation() {
    if (this.addressToSearch !== null && this.addressToSearch !== '') {
      console.log(this.addressToSearch);
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
    console.log(this.routeInfo[0] / 1000);
    const deliveryPrice = (this.routeInfo[0] / 1000) * 3;
    this.orderList.push(
      new OrderItem(
        `Dostawa - ${this.addressToSearch}`,
        Math.round(this.routeInfo[0] / 1000) * 3
      )
    );
    this.addressToSearch = '';
    this.mapShow = false;
  }

  async fetchData(){
    const data = await getDocs(collection(this.db, 'Menu' ));
    const dataList = data.docs.map(doc => {
      const record = doc.data();
      return new Pizza(record['name'], record['number'], record['category'], record['price'])
    })
    this.menuList = dataList;
  }
}
