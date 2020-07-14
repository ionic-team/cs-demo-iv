import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage';

import { SettingsService } from './settings.service';
import { createStorageMock } from '../../../../test/mocks';

describe('SettingsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: Storage, useFactory: createStorageMock }],
    }),
  );

  it('should be created', () => {
    const service: SettingsService = TestBed.inject(SettingsService);
    expect(service).toBeTruthy();
  });
});
