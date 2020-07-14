import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private keys = {
    biometrics: 'useBiometrics',
    passcode: 'usePasscode',
    secureStorageMode: 'useSecureStorageMode',
  };

  constructor(private storage: Storage) {}

  async useBiometrics(): Promise<boolean> {
    const v = await this.storage.get(this.keys.biometrics);
    return v;
  }

  async usePasscode(): Promise<boolean> {
    const v = await this.storage.get(this.keys.passcode);
    return v;
  }

  async useSecureStorageMode(): Promise<boolean> {
    const v = await this.storage.get(this.keys.secureStorageMode);
    return v;
  }

  async store(settings: {
    useBiometrics: boolean;
    usePasscode: boolean;
    useSecureStorageMode: boolean;
  }) {
    if (settings.useBiometrics !== undefined) {
      this.storage.set(this.keys.biometrics, settings.useBiometrics);
    }
    if (settings.usePasscode !== undefined) {
      this.storage.set(this.keys.passcode, settings.usePasscode);
    }
    if (settings.useSecureStorageMode !== undefined) {
      this.storage.set(
        this.keys.secureStorageMode,
        settings.useSecureStorageMode,
      );
    }
  }
}
