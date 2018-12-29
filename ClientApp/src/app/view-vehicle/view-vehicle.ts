import { PhotoService } from './../services/photo.service';
import { ToastyService } from 'ng2-toasty';
import { VehicleService } from './../services/vehicle.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
  templateUrl: 'view-vehicle.html'
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  vehicle: any;
  vehicleId: number;
  photos: any[];
  uploadPercentage: number;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private toasty: ToastyService,
    private photoService: PhotoService,
    private vehicleService: VehicleService) { 

    route.params.subscribe(p => {
      this.vehicleId = +p['id'];
      if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
        router.navigate(['/vehicles']);
        return; 
      }
    });
  }

  ngOnInit() { 
    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        v => this.vehicle = v,
        err => {
          if (err.status == 404) {
            this.router.navigate(['/vehicles']);
            return; 
          }
        });

    this.photoService.getPhotos(this.vehicleId)
        .subscribe(photos => this.photos = (photos as any[]));
  }

  delete() {
    if (confirm("Are you sure?")) {
      this.vehicleService.delete(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/vehicles']);
        });
    }
  }

  uploadPhoto(){
    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;


    this.photoService.upload(this.vehicleId, nativeElement.files[0])
      .subscribe(req => {
        if(req.type == HttpEventType.UploadProgress){
          this.uploadPercentage = Math.round(100 * req.loaded / req.total)
        }
        if(req.type == HttpEventType.Response){
          this.photos.push(req.body)
          this.uploadPercentage = null;
        }
        //photo => {
        //this.photos.push(photo);
      },
        err => {
          this.toasty.error({
            title: 'Error',
            msg: err.error,
            theme: 'bootstrap',
            showClose: true,
            timeout: 5000
          })
          console.log(err);
        }
      );
  }
}