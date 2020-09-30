import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AuthMode } from '@ionic-enterprise/identity-vault';

import { dependencies } from '../../../package.json';

import { AuthenticationService } from '../services/authentication';
import { IdentityService } from '../services/identity';
import { User } from '../models/user';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
})
export class AboutPage implements OnInit {
  angularVersion: string;
  capacitorVersion: string;
  frameworkVersion: string;
  identityVaultVersion: string;

  user: User;
  authMode: string;
  supportedHardware: string;

  constructor(
    private authentication: AuthenticationService,
    private identity: IdentityService,
    private toastController: ToastController,
  ) {}

  async ionViewDidEnter() {
    this.identity.get().subscribe(u => (this.user = u));
    this.authMode = AuthMode[await this.identity.getAuthMode()];
    this.supportedHardware = await this.identity.supportedBiometricTypes();
  }

  ngOnInit() {
    const verSpec = /[\^~]/;
    this.angularVersion = dependencies['@angular/core'].replace(verSpec, '');
    this.capacitorVersion = dependencies['@capacitor/core'].replace(
      verSpec,
      '',
    );
    this.frameworkVersion = dependencies['@ionic/angular'].replace(verSpec, '');
    this.identityVaultVersion = dependencies[
      '@ionic-enterprise/identity-vault'
    ].replace(verSpec, '');
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
            position: 'top',
          });
          toast.present();
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
