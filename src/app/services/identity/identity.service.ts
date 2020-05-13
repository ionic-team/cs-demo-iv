import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ModalController, Platform } from '@ionic/angular';
import {
  AuthMode,
  IonicIdentityVaultUser,
  IonicNativeAuthPlugin,
  DefaultSession,
  VaultConfig,
  VaultError,
  VaultErrorCodes
} from '@ionic-enterprise/identity-vault';

import { environment } from '../../../environments/environment';
import { User } from '../../models/user';
import { BrowserAuthPlugin } from '../browser-auth/browser-auth.plugin';
import { PinDialogComponent } from '../../pin-dialog/pin-dialog.component';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class IdentityService extends IonicIdentityVaultUser<DefaultSession> {
  private user: User;
  private _changed: Subject<DefaultSession>;

  get changed() {
    return this._changed.asObservable();
  }

  constructor(
    private browserAuthPlugin: BrowserAuthPlugin,
    private http: HttpClient,
    private modalController: ModalController,
    private router: Router,
    private plt: Platform,
    private settings: SettingsService
  ) {
    super(plt, {
      androidPromptTitle: 'Identity Vault Demo',
      androidPromptSubtitle: 'Demo All the Things!',
      androidPromptDescription: 'You need to unlock me',
      restoreSessionOnReady: false,
      unlockOnReady: false,
      unlockOnAccess: true,
      lockAfter: 5000,
      hideScreenOnBackground: true,
      allowSystemPinFallback: true,
      shouldClearVaultAfterTooManyFailedAttempts: false
    });
    this._changed = new Subject();
  }

  get(): Observable<User> {
    if (!this.user) {
      return this.http.get<User>(`${environment.dataService}/users/current`).pipe(tap(u => (this.user = u)));
    } else {
      return of(this.user);
    }
  }

  async set(user: User, token: string): Promise<void> {
    this.user = user;
    // This is just one sample login workflow. It mostly respects the settigs
    // that were last saved with the exception that it uses "Biometrics OR Passcode"
    // in the case were both were saved and the user logged out.
    const mode = (await this.useBiometrics())
      ? AuthMode.BiometricOnly
      : (await this.settings.usePasscode())
      ? AuthMode.PasscodeOnly
      : (await this.settings.useSecureStorageMode())
      ? AuthMode.SecureStorage
      : AuthMode.InMemoryOnly;
    const session: DefaultSession = { username: user.email, token: token };
    await this.login({ username: user.email, token: token }, mode);
    this._changed.next(session);
  }

  private async useBiometrics(): Promise<boolean> {
    const use = await Promise.all([this.settings.useBiometrics(), this.isBiometricsAvailable()]);
    return use[0] && use[1];
  }

  async remove(): Promise<void> {
    await this.logout();
    this.user = undefined;
    this._changed.next();
  }

  async getToken(): Promise<string> {
    if (!this.token) {
      await this.restoreSession();
    }
    return this.token;
  }

  async restoreSession(): Promise<DefaultSession> {
    try {
      return await super.restoreSession();
    } catch (error) {
      if (error.code === VaultErrorCodes.VaultLocked) {
        const vault = await this.getVault();
        await vault.clear();
      } else {
        throw error;
      }
    }
  }

  onSessionRestored(session: DefaultSession) {
    this._changed.next(session);
  }

  // In a real app, you don't want to log a lot of this. These events are just handled
  // here to demonstrate when they are called.
  onSetupError(error: VaultError): void {
    console.error('Get error during setup', error);
  }

  onConfigChange(config: VaultConfig): void {
    console.log('Got a config update: ', config);
  }

  onVaultReady(config: VaultConfig): void {
    console.log('The service is ready with config: ', config);
  }

  onVaultUnlocked(config: VaultConfig): void {
    console.log('The vault was unlocked with config: ', config);
  }

  async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<string> {
    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PinDialogComponent,
      componentProps: {
        setPasscodeMode: isPasscodeSetRequest
      }
    });
    dlg.present();
    const { data } = await dlg.onDidDismiss();
    return Promise.resolve(data || '');
  }

  onVaultLocked() {
    console.log('Vault Locked');
    this._changed.next();
    this.router.navigate(['login']);
  }

  getPlugin(): IonicNativeAuthPlugin {
    if (this.plt.is('capacitor')) {
      return super.getPlugin();
    }
    return this.browserAuthPlugin;
  }

  async supportedBiometricTypes(): Promise<string> {
    let result = '';
    const types = await this.getAvailableHardware();
    if (types) {
      types.forEach(t => (result += `${result ? ', ' : ''}${this.translateBiometricType(t)}`));
    }
    return result;
  }

  private translateBiometricType(type: string): string {
    switch (type) {
      case 'fingerprint':
        return 'Finger Print';
      case 'face':
        return 'Face Match';
      case 'iris':
        return 'Iris Scan';
    }
  }
}
