import { AuthService } from './services/auth.service';
import { ViewVehicleComponent } from './view-vehicle/view-vehicle';
import { PaginationComponent } from './shared/pagination.component';
import { AppErrorHandler } from './app.error-handler';
import { VehicleService } from './services/vehicle.service';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastyModule } from 'ng2-toasty';
import { HttpClientModule } from '@angular/common/http';
import { BrowserXhr } from '@angular/common/http/src/xhr';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import * as Sentry from "@sentry/browser";
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { PhotoService } from './services/photo.service';

Sentry.init({
  dsn: "https://1f59caa793f64572b63462de887a83c4@sentry.io/1360600"
});


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    VehicleFormComponent,
    VehicleListComponent,
    PaginationComponent,
    ViewVehicleComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ToastyModule.forRoot(),
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
      { path: 'vehicles/new', component: VehicleFormComponent },
      { path: 'vehicles/edit/:id', component: VehicleFormComponent },
      { path: 'vehicles/:id', component: ViewVehicleComponent },
      { path: 'vehicles', component: VehicleListComponent },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
    ])
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    AuthService,
    VehicleService,
    PhotoService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
