import { Component } from '@angular/core';
import { WaiterPanelComponent } from './waiter-panel/waiter-panel.component';
import { NominatimService } from './nominatim.service';
import { GraphhopperService } from './graphhopper.service';
import { KitchenPanelComponent } from './kitchen-panel/kitchen-panel.component';

@Component({
  selector: 'app-root',
  imports: [WaiterPanelComponent, KitchenPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'MozzaNG';
  routeInfo: number[] = [];
  panel: string = 'waiter'

  constructor(
    private nominatim: NominatimService,
    private graphhopper: GraphhopperService
  ) {}
  searchAddress(address: string) {
    this.nominatim.search(address).subscribe((nominatimResponse: any) => {
      if (nominatimResponse !== undefined && nominatimResponse !== null) {
        this.graphhopper
          .search(`${nominatimResponse[0].lat},${nominatimResponse[0].lon}`)
          .subscribe((graphhopperResponse: any) => {
            console.log('infoooo kurr' + graphhopperResponse)
            const value: number[] = []
            value[0] = parseFloat(graphhopperResponse.paths[0].distance);
            value[1] = parseFloat(graphhopperResponse.paths[0].time);
            value[2] = nominatimResponse[0].lat;
            value[3] = nominatimResponse[0].lon;
            this.routeInfo = value;

          });
      } else {
        alert('Błąd związany z zamianą adresu na współrzędne');
      }
    });
  }
}
