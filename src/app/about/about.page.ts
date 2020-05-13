import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication';
import { IdentityService } from '../services/identity';
import { User } from '../models/user';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { AuthMode } from '@ionic-enterprise/identity-vault';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage {
  user: User;
  authMode: string;
  supportedHardware: string;

  constructor(
    private authentication: AuthenticationService,
    private identity: IdentityService,
    private toastController: ToastController
  ) {}

  async ionViewDidEnter() {
    this.identity.get().subscribe(u => (this.user = u));
    this.authMode = AuthMode[await this.identity.getAuthMode()];
    this.supportedHardware = await this.identity.supportedBiometricTypes();
  }

  logout() {
    this.authentication
      .logout()
      .pipe(
        catchError(async err => {
          const toast = await this.toastController.create({
            message: 'Logout Failed! Please try again.',
            color: 'danger',
            duration: 1500,
            position: 'top'
          });
          toast.present();
          return EMPTY;
        })
      )
      .subscribe();
  }
}
