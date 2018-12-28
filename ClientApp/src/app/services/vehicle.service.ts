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

  getModels() {
    return this.http.get('/api/models').pipe(map(
      res => res as Model[]
    ))
  }

  getFeatures() {
    return this.http.get('/api/features').pipe(map(
      res => res as Feature[]
    ));
  }

  create(vehicle) {
    return this.http.post('/api/vehicles', vehicle);
  }

  getVehicle(id) {
    return this.http.get('/api/vehicles/' + id);
  }

  update(vehicle) {
    return this.http.put('/api/vehicles/' + vehicle.id, vehicle);
  }

  delete(id) {
    return this.http.delete('/api/vehicles/' + id);
  }

  getVehicles(filter) {
    return this.http.get('/api/vehicles' + '?' + this.toQueryString(filter));
  }

  toQueryString(obj) {
    var parts = [];
    for (var property in obj){
      var value = obj[property];
      if (value != null && value != undefined) {
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
      }
    }

    return parts.join('&');
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