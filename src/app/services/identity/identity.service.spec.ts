import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';

import { Platform, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import {
  createOverlayControllerMock,
  createPlatformMock,
  createRouterMock,
  createStorageMock,
} from '../../../../test/mocks';
import { environment } from '../../../environments/environment';
import { BrowserAuthPlugin } from '../browser-auth/browser-auth.plugin';
import { BrowserAuthService } from '../browser-auth/browser-auth.service';
import { IdentityService } from './identity.service';
import { SettingsService } from '../settings/settings.service';
import { createSettingsServiceMock } from '../settings/settings.mock';

describe('IdentityService', () => {
  let httpTestingController: HttpTestingController;
  let identity: IdentityService;

  beforeAll(() => {
    (window as any).IonicNativeAuth = new BrowserAuthPlugin(
      new BrowserAuthService(createStorageMock()),
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IdentityService,
        {
          provide: ModalController,
          useFactory: () => createOverlayControllerMock('Modal'),
        },
        { provide: Platform, useFactory: createPlatformMock },
        { provide: Router, useFactory: createRouterMock },
        { provide: SettingsService, useFactory: createSettingsServiceMock },
        { provide: Storage, useFactory: createStorageMock },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(inject([IdentityService], (service: IdentityService) => {
    identity = service;
  }));

  it('injects', () => {
    expect(identity).toBeTruthy();
  });

  describe('get', () => {
    it('gets the user', () => {
      identity.get().subscribe(u =>
        expect(u).toEqual({
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams',
          email: 'thank.you@forthefish.com',
        }),
      );
      const req = httpTestingController.expectOne(
        `${environment.dataService}/users/current`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        id: 42,
        firstName: 'Douglas',
        lastName: 'Adams',
        email: 'thank.you@forthefish.com',
      });
      httpTestingController.verify();
    });

    it('caches the user', () => {
      identity.get().subscribe(u =>
        expect(u).toEqual({
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams',
          email: 'thank.you@forthefish.com',
        }),
      );
      const req = httpTestingController.expectOne(
        `${environment.dataService}/users/current`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        id: 42,
        firstName: 'Douglas',
        lastName: 'Adams',
        email: 'thank.you@forthefish.com',
      });
      httpTestingController.verify();
      identity.get().subscribe(u =>
        expect(u).toEqual({
          id: 42,
          firstName: 'Douglas',
          lastName: 'Adams',
          email: 'thank.you@forthefish.com',
        }),
      );
      httpTestingController.verify();
    });
  });

  describe('set', () => {
    it('sets the user, caching it', () => {
      identity.set(
        {
          id: 314159,
          firstName: 'Sherry',
          lastName: 'Pigh',
          email: 'alamode@test.org',
        },
        'I am a token of some sort',
      );
      identity.get().subscribe(u =>
        expect(u).toEqual({
          id: 314159,
          firstName: 'Sherry',
          lastName: 'Pigh',
          email: 'alamode@test.org',
        }),
      );
      httpTestingController.verify();
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      identity.get().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/users/current`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        id: 42,
        firstName: 'Douglas',
        lastName: 'Adams',
        email: 'thank.you@forthefish.com',
      });
      httpTestingController.verify();
      spyOn(identity, 'logout').and.returnValue(Promise.resolve());
    });

    it('removes the user from the cache (thus forcing a GET on the next get())', async () => {
      identity.get().subscribe();
      httpTestingController.verify();
      await identity.remove();
      identity.get().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/users/current`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        id: 42,
        firstName: 'Douglas',
        lastName: 'Adams',
        email: 'thank.you@forthefish.com',
      });
      httpTestingController.verify();
    });
  });

  describe('on vault locked', () => {
    it('navigates to the login page', () => {
      const router = TestBed.inject(Router);
      identity.onVaultLocked();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['login']);
    });
  });
});
