import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';
import { IdentityService, createIdentityServiceMock } from '../identity';

describe('AuthenticationService', () => {
  let authentication: AuthenticationService;
  let httpTestingController: HttpTestingController;

  let identity;

  beforeEach(() => {
    identity = createIdentityServiceMock();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        { provide: IdentityService, useValue: identity },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(inject(
    [AuthenticationService],
    (service: AuthenticationService) => {
      authentication = service;
    },
  ));

  it('injects', () => {
    expect(authentication).toBeTruthy();
  });

  describe('login', () => {
    it('POSTs the login', () => {
      authentication
        .login('thank.you@forthefish.com', 'solongDude')
        .subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/login`,
      );
      expect(req.request.method).toEqual('POST');
      req.flush({});
      httpTestingController.verify();
    });

    it('passes the credentials in the body', () => {
      authentication
        .login('thank.you@forthefish.com', 'solongDude')
        .subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/login`,
      );
      expect(req.request.body).toEqual({
        username: 'thank.you@forthefish.com',
        password: 'solongDude',
      });
      req.flush({});
      httpTestingController.verify();
    });

    describe('on success', () => {
      let response;
      beforeEach(() => {
        response = {
          success: true,
          token: '48499501093kf00399sg',
          user: {
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams',
            email: 'thank.you@forthefish.com',
          },
        };
      });

      it('resolves true', fakeAsync(() => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe(r => expect(r).toEqual(true));
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`,
        );
        req.flush(response);
        tick();
        httpTestingController.verify();
        tick();
      }));

      it('sets the identity and token', () => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe();
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`,
        );
        req.flush(response);
        httpTestingController.verify();
        expect(identity.set).toHaveBeenCalledTimes(1);
        expect(identity.set).toHaveBeenCalledWith(
          {
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams',
            email: 'thank.you@forthefish.com',
          },
          '48499501093kf00399sg',
        );
      });
    });

    describe('on failure', () => {
      let response;
      beforeEach(() => {
        response = { success: false };
      });

      it('resolves false', fakeAsync(() => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe(r => expect(r).toEqual(false));
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`,
        );
        req.flush(response);
        tick();
        httpTestingController.verify();
        tick();
      }));

      it('does not set the identity', () => {
        authentication
          .login('thank.you@forthefish.com', 'solongDude')
          .subscribe();
        const req = httpTestingController.expectOne(
          `${environment.dataService}/login`,
        );
        req.flush(response);
        httpTestingController.verify();
        expect(identity.set).not.toHaveBeenCalled();
      });
    });
  });

  describe('logout', () => {
    it('POSTs the logout', fakeAsync(() => {
      let fired = false;
      authentication.logout().subscribe(() => (fired = true));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/logout`,
      );
      req.flush({});
      httpTestingController.verify();
      tick();
      identity.remove();
      expect(fired).toBeTruthy();
    }));

    it('remove the identity', fakeAsync(() => {
      authentication.logout().subscribe();
      const req = httpTestingController.expectOne(
        `${environment.dataService}/logout`,
      );
      req.flush({});
      tick();
      expect(identity.remove).toHaveBeenCalledTimes(1);
    }));
  });
});
