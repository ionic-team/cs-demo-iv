import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { AuthenticationService } from '../services/authentication';
import { IdentityService } from '../services/identity';
import { AuthMode, DefaultSession, VaultErrorCodes } from '@ionic-enterprise/identity-vault';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email: string;
  password: string;
  errorMessage: string;

  loginType: string;
  displayVaultLogin: boolean;

  constructor(
    private authentication: AuthenticationService,
    private identity: IdentityService,
    private navController: NavController
  ) {}

  ionViewWillEnter() {
    try {
      this.setUnlockType();
    } catch (e) {
      console.error('Unable to check token status', e);
    }
  }

  async unlockClicked() {
    const hasSession = await this.identity.hasStoredSession();

    if (hasSession) {
      const session = await this.tryRestoreSession();
      if (session && session.token) {
        this.goToApp();
        return;
      }
    }
  }

  signInClicked() {
    this.authentication.login(this.email, this.password).subscribe(
      (success: boolean) => {
        this.password = '';
        if (success) {
          this.email = '';
          this.errorMessage = '';
          this.navController.navigateRoot('/tabs/home');
        } else {
          this.errorMessage = 'Invalid e-mail address or password';
        }
      },
      (err: any) => {
        this.password = '';
        this.errorMessage = 'Unknown login error';
        console.error(err);
      }
    );
  }

  private goToApp() {
    this.navController.navigateRoot('/tabs/home');
  }

  private async tryRestoreSession(): Promise<DefaultSession> {
    try {
      return await this.identity.restoreSession();
    } catch (error) {
      alert('Unable to unlock the token');
      this.setUnlockType();
      if (this.notFailedOrCancelled(error)) {
        throw error;
      }
    }
  }

  private notFailedOrCancelled(error: any) {
    return error.code !== VaultErrorCodes.AuthFailed && error.code !== VaultErrorCodes.UserCanceledInteraction;
  }

  private async setUnlockType(): Promise<void> {
    const previousLoginType = this.loginType;
    await this.determineLoginType();
    if (previousLoginType && !this.loginType) {
      alert('The vault is no longer accessible. Please login again');
    }
  }

  private async determineLoginType() {
    if (await this.identity.hasStoredSession()) {
      const authMode = await this.identity.getAuthMode();
      switch (authMode) {
        case AuthMode.BiometricAndPasscode:
          this.loginType = await this.translateBiometricType();
          this.loginType += ' (Passcode Fallback)';
          break;
        case AuthMode.BiometricOnly:
          const vault = await this.identity.getVault();
          const bioLockedOut = await vault.isLockedOutOfBiometrics();
          const bioAvailable = await this.identity.isBiometricsAvailable();
          // Making this conditional on Bio being locked out only makes sense if we are using
          // allowSystemPinFallback like we are in this demo
          this.loginType = bioAvailable || bioLockedOut ? await this.translateBiometricType() : '';
          break;
        case AuthMode.PasscodeOnly:
          this.loginType = 'Passcode';
          break;
        case AuthMode.SecureStorage:
          this.loginType = 'Secure Storage';
          break;
      }
    } else {
      this.loginType = '';
    }
  }

  private async translateBiometricType(): Promise<string> {
    const type = await this.identity.getBiometricType();
    switch (type) {
      case 'touchID':
        return 'TouchID';
      case 'faceID':
        return 'FaceID';
    }

    return type;
  }
}
