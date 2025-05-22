import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import {
  onSnapshot,
  where,
  query,
  getFirestore,
  collection,
  getDocs,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { IOrder } from './model/class-templates';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  app = initializeApp(environment.firebaseConfig);
  database = getFirestore(this.app);

  constructor() {}

  async fetchDataMenu() {
    const data = await getDocs(
      query(collection(this.database, 'Menu'), orderBy('number'))
    );
    return data.docs.map((element) => {
      return {
        name: element.data()['name'],
        number: element.data()['number'],
        category: element.data()['category'],
        price: element.data()['price'],
      };
    });
  }

  async fetchDataOrdersKitchen(status: string): Promise<IOrder[]> {
    const q = query(
      collection(this.database, 'Orders'),
      where('status', '==', status)
    );
    let orderList: IOrder[] = [];
    const a = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const order = {
            id: change.doc.id,
            type: change.doc.data()['type'],
            dateDeliver: change.doc.data()['dateDeliver'],
            products: change.doc.data()['products'],
            address: change.doc.data()['address'],
            status: change.doc.data()['status'],
            payment: change.doc.data()['payment'],
          };
          orderList.push(order);
        }
      });
    });
    return orderList;
  }

  async addDataOrder(order: IOrder) {
    if (order.id) {
      await setDoc(doc(this.database, 'Orders', order.id), {
        type: order.type,
        dateDeliver: order.dateDeliver,
        products: order.products,
        address: order.address,
        status: order.status,
        payment: order.payment,
      });
    } else {
      await addDoc(collection(this.database, 'Orders'), {
        type: order.type,
        dateDeliver: order.dateDeliver,
        products: order.products,
        address: order.address,
        status: order.status,
        payment: order.payment,
      });
    }
  }

  async setOrderStatus(orderID: string, newStatus: string) {
    await updateDoc(doc(this.database, 'Orders', orderID), {
      status: newStatus,
    });
  }

  async deleteOldOrders() {
    const q = query(
      collection(this.database, 'Orders'),
      where('status', '==', 'Gotowe')
    );

    const a = await getDocs(q);
    const ordersToDelete = a.docs
      .filter((element) => {
        const dateDeliver = element.data()['dateDeliver'];
        return Date.now() - dateDeliver.toDate().getTime() > 86400000;
      })
      .map((element) => {return element.id});

    console.log(ordersToDelete);

    ordersToDelete.forEach(async orderID => {
      await deleteDoc(doc(this.database, 'Orders', orderID));
    }

    )
  }
}
