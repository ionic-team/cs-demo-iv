import { of, Subject } from 'rxjs';

export function createVaultMock() {
  return jasmine.createSpyObj('IdentityVault', {
    isLockedOutOfBiometrics: Promise.resolve(false),
  });
}

export function createIdentityServiceMock() {
  const vault = createVaultMock();
  const identity = jasmine.createSpyObj('IdentityService', {
    get: of(null),
    hasStoredSession: Promise.resolve(false),
    getAuthMode: Promise.resolve(''),
    getBiometricType: Promise.resolve(''),
    getAvailableHardware: Promise.resolve([]),
    getVault: Promise.resolve(vault),
    isBiometricsAvailable: Promise.resolve(false),
    isBiometricsEnabled: Promise.resolve(false),
    isPasscodeEnabled: Promise.resolve(false),
    isSecureStorageModeEnabled: Promise.resolve(false),
    ready: Promise.resolve(),
    remove: Promise.resolve(),
    restoreSession: Promise.resolve(),
    set: Promise.resolve(),
    supportedBiometricTypes: Promise.resolve(''),
  });

  identity.changed = new Subject();

  return identity;
}
