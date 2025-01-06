import { Component } from '@angular/core';

class Order {
  type: string;
  dateDeliver: string;
  products: string[];
  address: string;
  status: string;

  constructor(
    type: string,
    dateDeliver: string,
    products: string[],
    address: string,
    status: string
  ) {
    this.type = type;
    this.dateDeliver = dateDeliver;
    this.products = products;
    this.address = address;
    this.status = status
  }

  // <p>{{orderItem.type}}</p>
  // <p>{{orderItem.dateDeliver}}</p>
  // <p>{{orderItem.products}}</p>
  // <p>{{orderItem.address}}</p>
}

@Component({
  selector: 'app-kitchen-panel',
  imports: [],
  templateUrl: './kitchen-panel.component.html',
  styleUrl: './kitchen-panel.component.scss',
})
export class KitchenPanelComponent {
  orderList: Order[] = [
    new Order(
      'Pyszne',
      '17:45',
      ['#17. Bambini Felici#7.2. Quattro Colori#8. Italian Lover"'],
      'Gzikowa 14/2', 'kuchnia'
    ),
    new Order(
      'Sala',
      '18:15',
      ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
      'sala', 'kuchnia'
    ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Pyszne',
    //   '17:45',
    //   ['#17. Bambini Felici#7.2. Quattro Colori#8. Italian Lover"'],
    //   'Gzikowa 14/2'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Pyszne',
    //   '17:45',
    //   ['#17. Bambini Felici#7.2. Quattro Colori#8. Italian Lover"'],
    //   'Gzikowa 14/2'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Pyszne',
    //   '17:45',
    //   ['#17. Bambini Felici#7.2. Quattro Colori#8. Italian Lover"'],
    //   'Gzikowa 14/2'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),
    // new Order(
    //   'Sala',
    //   '18:15',
    //   ['#11. Capriciosa#21. Frutti di Mare (bez mozzarelli)'],
    //   'sala'
    // ),

  ];
}
