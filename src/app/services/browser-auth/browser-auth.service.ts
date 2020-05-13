import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  BiometricType,
  IdentityVault,
  PluginConfiguration,
  AuthMode,
  SupportedBiometricType
} from '@ionic-enterprise/identity-vault';

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

  async unsubscribe(): Promise<void> {}

  async clear(): Promise<void> {}

  async lock(): Promise<void> {}

  async isLocked(): Promise<boolean> {
    return false;
  }

  async isInUse(): Promise<boolean> {
    return !!(await this.storage.get('session'));
  }

  async getConfig(): Promise<PluginConfiguration> {
    return this.config;
  }

  async remainingAttempts(): Promise<number> {
    return 5;
  }

  async getUsername(): Promise<string> {
    return 'MyUsername';
  }

  async storeToken(token: any): Promise<void> {}

  async getToken(): Promise<any> {
    return 'MyToken';
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

  async getBiometricType(): Promise<BiometricType> {
    return 'none';
  }

  async getAvailableHardware(): Promise<Array<SupportedBiometricType>> {
    return [];
  }

  async setBiometricsEnabled(isBiometricsEnabled: boolean): Promise<void> {}

  async isBiometricsEnabled(): Promise<boolean> {
    return false;
  }

  async isBiometricsAvailable(): Promise<boolean> {
    return false;
  }

  async isBiometricsSupported(): Promise<boolean> {
    return false;
  }

  async isLockedOutOfBiometrics(): Promise<boolean> {
    return false;
  }

  async isPasscodeSetupNeeded(): Promise<boolean> {
    return false;
  }

  async setPasscode(passcode?: string): Promise<void> {}

  async isPasscodeEnabled(): Promise<boolean> {
    return false;
  }

  async isSecureStorageModeEnabled(): Promise<boolean> {
    return true;
  }

  async setPasscodeEnabled(isPasscodeEnabled: boolean): Promise<void> {}

  async setSecureStorageModeEnabled(enabled: boolean): Promise<void> {}

  async unlock(usingPasscode?: boolean, passcode?: string): Promise<void> {}
}
