import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class GraphhopperService {
  constructor(private httpClient: HttpClient) {}

  public search(destination: string): Observable<number[]> {
    const params = new HttpParams()
      .append('point', '51.2627851, 22.5063528')
      .append('point', destination)
      .append('profile', 'car')
      .append('locale', 'en')
      .append('key', environment.graphHopperApi);
    return this.httpClient
      .get<any>('https://graphhopper.com/api/1/route', {
        params,
      })
      .pipe(
        map((response) => [
          parseFloat(response.paths[0].distance),
          parseFloat(response.paths[0].time),
        ])
      );
  }
}
