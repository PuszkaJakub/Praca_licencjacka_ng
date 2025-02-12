import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc
} from 'firebase/firestore/lite';
// import { environment } from '../environments/environment';
import {where} from 'firebase/firestore';
import { Order } from './model/class-templates';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  
  netlifyFirebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
  }
  // app = initializeApp(environment.firebaseConfig);
  app = initializeApp(this.netlifyFirebaseConfig);
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

  async fetchDataOrdersKitchen() {
    const data = await getDocs(
      query(
        collection(this.database, 'Orders'),
        where('status', '==', 'kitchen'),
        orderBy('dateDeliver')
      )
    );
    const data1 = data.docs.map(doc => {
      console.log(doc.data())
      return doc.data()
    })
    return data1;
  }

  async addDataOrder(order: Order){
    await addDoc(collection(this.database, 'Orders'), order)
  }
}
