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
  panel: string = 'kitchen'

  constructor(
    private nominatim: NominatimService,
    private graphhopper: GraphhopperService
  ) {}
  searchAddress(address: string) {
    this.nominatim.search(address).subscribe((nominatimResponse: any) => {
      if (nominatimResponse !== undefined && nominatimResponse !== null) {
        const coordinates = [
          nominatimResponse[0].lat,
          nominatimResponse[0].lon,
        ];
        this.graphhopper
          .search(`${coordinates[0]},${coordinates[1]}`)
          .subscribe((graphhopperResponse: any) => {
            this.routeInfo[0] = parseFloat(graphhopperResponse.paths[0].distance);
            this.routeInfo[1] = parseFloat(graphhopperResponse.paths[0].time);
          });
      } else {
        alert('Błąd związany z zamianą adresu na współrzędne');
      }

      // this.pages = response.lat;
    });
  }
}
