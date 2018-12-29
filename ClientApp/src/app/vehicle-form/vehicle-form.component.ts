import * as _ from 'underscore';
import { SaveVehicle, Vehicle } from './../models/vehicle';
import { Observable } from 'rxjs';
import { VehicleService } from '../services/vehicle.service';
import { Component, OnInit, isDevMode } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/Observable/forkJoin';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[];
  models: any[];
  features: any[];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      email: '', 
      phone: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService : VehicleService,
    private toastyService: ToastyService
    ) {
      route.params.subscribe(p => {
        this.vehicle.id = +p['id'] || 0;
      })
   }

  ngOnInit() {
    var sources = []

    this.vehicle.id ? (sources = [
      this.vehicleService.getFeatures(),
      this.vehicleService.getMakes(),
      this.vehicleService.getVehicle(this.vehicle.id)
    ]) : (sources = [
      this.vehicleService.getFeatures(),
      this.vehicleService.getMakes()
    ])

    Observable.forkJoin(
      sources
    ).subscribe(data => {
      this.features = data[0];
      this.makes = data[1];
      
      if (this.vehicle.id)
        this.setVehicle(data[2]);
        this.populateModels();
    }, err => {
      if (err.status === 404){
               console.log(err.status)
               this.router.navigate(['/']);
      }
    });

    // if (!isNaN(this.vehicle.id)) {
    // this.vehicleService.getVehicle(this.vehicle.id)
    //   .subscribe(v => {
    //     this.vehicle = v;
    //   }, err => {
    //     if (err.status === 404){
    //       console.log(err.status)
    //       this.router.navigate(['/']);
    //     }
    //   });
    // }

    // this.vehicleService.getMakes().subscribe(res => {
    //   this.makes = res;
    // });

    // this.vehicleService.getFeatures().subscribe(res => {
    //   this.features = res;
    // })
  }

  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id');
  }

  onMakeChange(){
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    this.models =  selectedMake ? selectedMake.models : [];
  }

  onFeatureToggle(featureId, $event) {
    if ( $event.target.checked ) {
      this.vehicle.features.push(featureId);
    } else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit() {
    if (this.vehicle.id) {
      this.vehicleService.update(this.vehicle)
        .subscribe(vehicle => {
          this.toastyService.success({
            title: 'Success',
            msg: 'The vehicle was successfully updated.',
            theme: 'bootstrap',
            showClose: true,
            timeout: 5000
          });
          this.router.navigate(['/vehicles/', (vehicle as any).id])
        })
    } else {
      this.vehicleService.create(this.vehicle)
      .subscribe(vehicle => {
        this.toastyService.success({
          title: 'Success',
          msg: 'The vehicle was successfully created.',
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
        });
        this.router.navigate(['/vehicles/', (vehicle as any).id]);
      })
    }
    
    
  }

  delete() {
    if (confirm("Are you sure?")) {
      this.vehicleService.delete(this.vehicle.id)
        .subscribe( x => {
          this.router.navigate(['/']);
        });
    }
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