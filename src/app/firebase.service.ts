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
} from 'firebase/firestore';
import { Order } from './model/class-templates';

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
    return data.docs.map((doc) => {
      // console.log(doc.data())
      return doc.data();
    });
  }

  async fetchDataOrdersKitchen(): Promise<Order[]> {
    const q = query(
      collection(this.database, 'Orders'),
      where('status', '==', 'Kuchnia')
    );
    let orderList: Order[] = [];
    const ala = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const order = {
            type: change.doc.data()['type'],
            dateDeliver: change.doc.data()['dateDeliver'],
            products: change.doc.data()['products'],
            address: change.doc.data()['address'],
            status: change.doc.data()['status'],
            payment: change.doc.data()['payment']
          }
          orderList.push(order)
      }

      });
      

    });
    return(orderList)
  }

  async addDataOrder(order: Order) {
    await addDoc(collection(this.database, 'Orders'), order);
  }
}
