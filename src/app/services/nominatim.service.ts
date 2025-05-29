import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NominatimService {
  constructor(private httpClient: HttpClient) {}

  public search(address: string): Observable<number[]> {
    const params = new HttpParams()
      .append('q', address)
      .append('format', 'json');

    return this.httpClient
      .get<any>('https://nominatim.openstreetmap.org/search', { params })
      .pipe(map((response) => [response[0].lat, response[0].lon]));
  }
}
