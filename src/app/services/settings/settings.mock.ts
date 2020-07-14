export function createSettingsServiceMock() {
  return jasmine.createSpyObj('SettingsService', {
    store: Promise.resolve(),
    useBiometrics: Promise.resolve(),
    usePasscode: Promise.resolve(),
    useSecureStorageMode: Promise.resolve(),
  });
}
