import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class NominatimService {
  constructor(private httpClient: HttpClient) {}

  public search(address: string) {
    const params = new HttpParams()
      .append('q', address)
      .append('format', 'json');

    return this.httpClient.get('https://nominatim.openstreetmap.org/search', {
      params,
    });
  }
}
