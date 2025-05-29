import { Component, ViewChild, effect, inject } from '@angular/core';
import { WaiterPanelComponent } from './waiter-panel/waiter-panel.component';
import { KitchenPanelComponent } from './kitchen-panel/kitchen-panel.component';
import { NominatimService } from './services/nominatim.service';
import { GraphhopperService } from './services/graphhopper.service';
import { IOrder } from './model/class-templates';

@Component({
  selector: 'app-root',
  imports: [WaiterPanelComponent, KitchenPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(WaiterPanelComponent) waiterPanel!: WaiterPanelComponent;
  title = 'MozzaNG';
  routeInfo: number[] = [];
  panel: string = 'kitchen';
  private nominatim = inject(NominatimService);
  private graphhopper = inject(GraphhopperService);

  constructor() {}

  searchAddress(address: string) {
    this.nominatim.search(address).subscribe((nominatimResponse: any) => {
      if (nominatimResponse !== undefined && nominatimResponse !== null) {
        this.graphhopper
          .search(`${nominatimResponse[0]},${nominatimResponse[1]}`)
          .subscribe((graphhopperResponse: any) => {
            console.log(graphhopperResponse);
            const value: number[] = [
              graphhopperResponse[0],
              graphhopperResponse[1],
              nominatimResponse[0],
              nominatimResponse[1],
            ];
            this.routeInfo = value;
          });
      } else {
        alert('Błąd związany z zamianą adresu na współrzędne');
      }
    });
  }

  handleOrderEdit(order: IOrder) {
    this.waiterPanel.fillOrderToEdit(order);
    alert('Edycja zamówienia\nZostaniesz przekierowany do panelu kelnera');
    this.panel = 'waiter';
  }
}
