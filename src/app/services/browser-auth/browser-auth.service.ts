import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BiometricType, IdentityVault, PluginConfiguration, AuthMode } from '@ionic-enterprise/identity-vault';

@Injectable({
  providedIn: 'root'
})
export class BrowserAuthService implements IdentityVault {
  constructor(private storage: Storage) {}

  config = {
    authMode: AuthMode.SecureStorage,
    descriptor: {
      username: '',
      vaultId: ''
    },
    isBiometricsEnabled: false,
    isPasscodeEnabled: false,
    isPasscodeSetupNeeded: false,
    isSecureStorageModeEnabled: true,
    hideScreenOnBackground: false,
    lockAfter: 50000
  };

  unsubscribe(): Promise<void> {
    return Promise.resolve();
  }

  clear(): Promise<void> {
    return this.storage.clear();
  }

  lock(): Promise<void> {
    return Promise.resolve();
  }

  async isLocked(): Promise<boolean> {
    return false;
  }

  async isLockedOutOfBiometrics(): Promise<boolean> {
    return true;
  }

  async isInUse(): Promise<boolean> {
    return !!(await this.storage.get('session'));
  }

  getConfig(): Promise<PluginConfiguration> {
    return Promise.resolve(this.config);
  }

  remainingAttempts(): Promise<number> {
    return Promise.resolve(5);
  }

  getUsername(): Promise<string> {
    return Promise.resolve('MyUsername');
  }

  storeToken(token: any): Promise<void> {
    return Promise.resolve();
  }

  getToken(): Promise<any> {
    return Promise.resolve('MyToken');
  }

  async storeValue(key: string, value: any): Promise<void> {
    await this.storage.set(key, value);
  }

  getValue(key: string): Promise<any> {
    return this.storage.get(key);
  }

  async removeValue(key: string): Promise<void> {
    await this.storage.remove(key);
  }

  getKeys(): Promise<Array<string>> {
    return this.storage.keys();
  }

  getBiometricType(): Promise<BiometricType> {
    const none: BiometricType = 'none';
    return Promise.resolve(none);
  }

  setBiometricsEnabled(isBiometricsEnabled: boolean): Promise<void> {
    return Promise.resolve();
  }

  isBiometricsEnabled(): Promise<boolean> {
    return Promise.resolve(false);
  }

  isBiometricsAvailable(): Promise<boolean> {
    return Promise.resolve(false);
  }

  isBiometricsSupported(): Promise<boolean> {
    return Promise.resolve(false);
  }

  isPasscodeSetupNeeded(): Promise<boolean> {
    return Promise.resolve(false);
  }

  setPasscode(passcode?: string): Promise<void> {
    return Promise.resolve();
  }

  isPasscodeEnabled(): Promise<boolean> {
    return Promise.resolve(false);
  }

  isSecureStorageModeEnabled(): Promise<boolean> {
    return Promise.resolve(true);
  }

  setPasscodeEnabled(isPasscodeEnabled: boolean): Promise<void> {
    return Promise.resolve();
  }

  setSecureStorageModeEnabled(enabled: boolean): Promise<void> {
    return Promise.resolve();
  }

  unlock(usingPasscode?: boolean, passcode?: string): Promise<void> {
    return Promise.resolve();
  }
}
