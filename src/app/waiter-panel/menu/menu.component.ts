import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IOrderItem, IMenuPosition } from '../../model/class-templates';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-menu',
  imports: [ReactiveFormsModule],
  templateUrl: './menu.component.html',
  styleUrl: '../waiter-panel.component.scss',
})
export class MenuComponent {
  @Input() menuList: IMenuPosition[] = [];
  @Output() callAddItem = new EventEmitter<IOrderItem>();

  constructor() {}
  extraItemForm = new FormGroup({
    price: new FormControl('', [Validators.required]),
  });

  sendAddItemRequest(newItem: IOrderItem) {
    this.callAddItem.emit(newItem);
  }

  passMenuItem(index: number) {
    if (index >= 0 && index <= this.menuList.length) {
      const newItem: IOrderItem = {
        name: this.menuList[index].number + ' ' + this.menuList[index].name,
        price: this.menuList[index].price,
        inEdit: false,
        type: this.menuList[index].category,
      };
      this.callAddItem.emit(newItem);
    }
  }

  passExtraItem() {
    const price: number = parseInt(
      String(this.extraItemForm.get('price')?.value)
    );
    const newItem: IOrderItem = {
      name: 'Inne - ' + price + ' zł',
      price: price,
      inEdit: false,
      type: 'Extra',
    };
    this.callAddItem.emit(newItem);
    this.extraItemForm.reset();
  }

  fillOrderList(products: string[]) {
    console.log(products);
    for (let product of products) {
      if (product.split(' ')[0] === 'Inne') {
        const newItem: IOrderItem = {
          name: product,
          price: parseInt(product.split(' ')[2]),
          inEdit: false,
          type: 'Extra',
        };
        this.callAddItem.emit(newItem);
        continue;
      }
      const productNumber = parseFloat(product.split(' ')[0]);
      const menuItemIndex = this.menuList.findIndex(
        (item) => item.number == productNumber
      );
      if (menuItemIndex !== -1) {
        this.passMenuItem(menuItemIndex);
      }
    }
  }
}
