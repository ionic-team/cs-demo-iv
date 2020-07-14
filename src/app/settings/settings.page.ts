import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthMode } from '@ionic-enterprise/identity-vault';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication';
import { IdentityService } from '../services/identity';
import { SettingsService } from '../services/settings/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements OnInit {
  useBiometrics: boolean;
  usePasscode: boolean;
  useSecureStorageMode: boolean;
  biometricType: string;

  constructor(
    private authentication: AuthenticationService,
    private identity: IdentityService,
    private toastController: ToastController,
    private settings: SettingsService,
  ) {}

  async ngOnInit() {
    await this.identity.ready();
    await this.setAuthModeFlags();
    this.biometricType = await this.identity.supportedBiometricTypes();
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

  async authModeChanged() {
    if (this.useSecureStorageMode) {
      await this.identity.setAuthMode(AuthMode.SecureStorage);
    } else if (this.useBiometrics && this.usePasscode) {
      await this.identity.setAuthMode(AuthMode.BiometricAndPasscode);
    } else if (this.useBiometrics && !this.usePasscode) {
      await this.identity.setAuthMode(AuthMode.BiometricOnly);
    } else if (this.usePasscode && !this.useBiometrics) {
      await this.identity.setAuthMode(AuthMode.PasscodeOnly);
    } else {
      await this.identity.setAuthMode(AuthMode.InMemoryOnly);
    }
    await this.setAuthModeFlags();
  }

  lock() {
    this.identity.lockOut();
  }

  private async setAuthModeFlags() {
    this.usePasscode = await this.identity.isPasscodeEnabled();
    this.useBiometrics = await this.identity.isBiometricsEnabled();
    this.useSecureStorageMode = await this.identity.isSecureStorageModeEnabled();

    this.settings.store({
      useBiometrics: this.useBiometrics,
      usePasscode: this.usePasscode,
      useSecureStorageMode: this.useSecureStorageMode,
    });
  }
}
