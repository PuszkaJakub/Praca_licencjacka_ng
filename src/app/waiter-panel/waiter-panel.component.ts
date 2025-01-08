import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, getDocs } from '@angular/fire/firestore';
import { AsyncPipe } from '@angular/common';
import { environment } from '../../environments/environment';

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

const menu: Pizza[] = [
  new Pizza('Margheritta', 1, 'Wege', 33),
  new Pizza('Mozza', 2, 'Wege', 37),
  new Pizza('Grilled Garden', 3, 'Wege', 40),
  new Pizza('Pesto (bez mozzarelli)', 4, 'Wege', 40),
  new Pizza('Popey', 5, 'Wege', 40),
  new Pizza('Quattro Formaggi', 6, 'Wege', 41),
  new Pizza('Greco (bianca, bez sosu)', 7, 'Wege', 41),
  new Pizza('Sweet Balsamico', 7.1, 'Wege', 41),
  new Pizza('Quattro Colori', 7.2, 'Wege', 41),
  new Pizza('Italian Lover', 8, 'Z Mięskiem', 41),
  new Pizza('Crudo', 9, 'Z Mięskiem', 41),
  new Pizza('Diesel Rider', 10, 'Z Mięskiem', 41),
  new Pizza('Capriciosa', 11, 'Z Mięskiem', 41),
  new Pizza('Hells Bells', 12, 'Z Mięskiem', 41),
  new Pizza('Jalapeno Honey', 13, 'Z Mięskiem', 41),
  new Pizza('Hot Honey', 13.1, 'Z Mięskiem', 41),
  new Pizza('Pancetta Funghi', 14, 'Z Mięskiem', 41),
  new Pizza('Pancetta Rosmarino', 15, 'Z Mięskiem', 41),
  new Pizza('Spianata Piccante', 16, 'Z Mięskiem', 37),
  new Pizza('Bambini Felici', 17, 'Z Mięskiem', 41),
  new Pizza('Costarica', 18, 'Z Mięskiem', 41),
  new Pizza('Tonno', 19, 'Z Owocami Morza', 44),
  new Pizza('Forrest Gump', 20, 'Z Owocami Morza', 44),
  new Pizza('Frutti di Mare (bez mozzarelli)', 21, 'Z Owocami Morza', 41),
  new Pizza('Alla Puttanesca (bez mozzarelli)', 22, 'Z Owocami Morza', 40),
];

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

  private firestore = inject(Firestore);
  itemsa: Observable<any[]>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.numberOfProducts = 0;
    this.orderTotal = 0;
    this.menuList = menu;
    this.orderList = [];
    this.addressToSearch = '';
    this.mapShow = false;

    const aCollection = getDocs(collection(this.firestore, 'items'));
    console.log(aCollection)

    this.itemsa = collectionData(collection(this.firestore, 'items')) as Observable<any[]>;    
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

  clearOrder() {
    this.orderList = [];
    // console.log(this.itemsa)
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
}
