import * as Sentry from "@sentry/browser";
import { ErrorHandler, Inject, NgZone, isDevMode } from '@angular/core';
import { ToastyService } from 'ng2-toasty';

export class AppErrorHandler implements ErrorHandler {

  /**
   *
   */
  constructor(private ngZone : NgZone, @Inject(ToastyService) private toastyService: ToastyService) {
    
  }

  handleError(error: any): void {
    //console.log("Error")
    if(!isDevMode) {
      Sentry.captureException(error.originalError || error);
    } 
    
    this.ngZone.run(() => {
        this.toastyService.error({
          title: 'Error',
          msg: error.error,
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
        });
        console.log(error);

    })
  }
}