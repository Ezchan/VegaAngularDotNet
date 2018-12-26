import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  getMakes() {
    return this.http.get('/api/makes').pipe(map(
      res => res as Make[]
    ));
  }

  getFeatures() {
    return this.http.get('/api/features').pipe(map(
      res => res as Feature[]
    ));
  }
}

interface Make {
  Id: number,
  Name: string,
  Models: Model[],
  MakeId: number
}

interface Model {
  Id: number,
  Name: string,
  Make: Make,
  MakeId: number
}

interface Feature {
  Id: number,
  Name: string
}