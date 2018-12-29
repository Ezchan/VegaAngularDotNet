import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';

@Injectable()
export class PhotoService {

  constructor(private http: HttpClient) { }

  upload(vehicleId, photo){
    var formData = new FormData();
    formData.append('file', photo)
    const req =  new HttpRequest('POST', `/api/vehicles/${vehicleId}/photos`, formData, {
      reportProgress: true
    } )

    return this.http.request(req);
    //this.http.post(`/api/vehicles/${vehicleId}/photos`, formData);

  }
  
  getPhotos(vehicleId) {
    return this.http.get(`/api/vehicles/${vehicleId}/photos`);
  }
}