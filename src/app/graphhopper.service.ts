import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GraphhopperService {

  constructor(private httpClient: HttpClient) {}

    public search(destination: string) {
      const params = new HttpParams()
        .append('point', "51.2627851, 22.5063528")
        .append('point', 	destination)
        .append('profile', 'car')
        .append('locale', 'en')
        // .append('key', environment.graphHopperApi);
        .append('key', process.env.graphHopperApi);

      return this.httpClient.get("https://graphhopper.com/api/1/route", { params });
  }
}
