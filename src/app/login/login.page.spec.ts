import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthMode } from '@ionic-enterprise/identity-vault';

import { of } from 'rxjs';

import { AuthenticationService, createAuthenticationServiceMock } from '../services/authentication';
import { IdentityService, createIdentityServiceMock } from '../services/identity';
import { LoginPage } from './login.page';
import { createNavControllerMock } from '../../../test/mocks';

describe('LoginPage', () => {
  let authentication;
  let identity;
  let navController;

  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    authentication = createAuthenticationServiceMock();
    identity = createIdentityServiceMock();
    navController = createNavControllerMock();
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: AuthenticationService, useValue: authentication },
        { provide: IdentityService, useValue: identity },
        { provide: NavController, useValue: navController },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on view enter', () => {
    describe('with biometrics enabled', () => {
      beforeEach(() => {
        identity.isBiometricsEnabled.and.returnValue(Promise.resolve(true));
        identity.getAuthMode.and.returnValue(Promise.resolve(AuthMode.BiometricOnly));
      });

      describe('with a stored token', () => {
        beforeEach(() => {
          identity.hasStoredSession.and.returnValue(Promise.resolve(true));
        });

        it('gets the biometric type', fakeAsync(() => {
          identity.isBiometricsAvailable.and.returnValue(Promise.resolve(true));
          identity.getBiometricType.and.returnValue(Promise.resolve('blood'));
          component.ionViewWillEnter();
          tick();
          expect(component.loginType).toEqual('blood');
        }));

        it('does not get the biometric type if biometrics is not available', fakeAsync(() => {
          identity.isBiometricsAvailable.and.returnValue(Promise.resolve(false));
          identity.getBiometricType.and.returnValue(Promise.resolve('blood'));
          component.ionViewWillEnter();
          tick();
          expect(component.loginType).toEqual('');
        }));
      });

      describe('without a stored token', () => {
        beforeEach(() => {
          identity.hasStoredSession.and.returnValue(Promise.resolve(false));
        });

        it('does not get the biometric type', fakeAsync(() => {
          identity.getBiometricType.and.returnValue(Promise.resolve('blood'));
          component.ionViewWillEnter();
          tick();
          expect(identity.getBiometricType).not.toHaveBeenCalled();
          expect(component.loginType).toEqual('');
        }));
      });
    });
  });

  describe('clicking the unlock button', () => {
    it('determines if the user has a stored session', async () => {
      await component.unlockClicked();
      expect(identity.hasStoredSession).toHaveBeenCalledTimes(1);
    });

    describe('with a stored session', () => {
      beforeEach(() => {
        identity.hasStoredSession.and.returnValue(Promise.resolve(true));
      });

      describe('when the token is blank', () => {
        it('does not navigate', async () => {
          await component.unlockClicked();
          expect(navController.navigateRoot).not.toHaveBeenCalled();
        });
      });

      describe('when the token is non-blank', () => {
        beforeEach(() => {
          identity.restoreSession.and.returnValue(Promise.resolve({ token: 'I am a stored token' }));
        });

        it('navigates home', async () => {
          await component.unlockClicked();
          expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
          expect(navController.navigateRoot).toHaveBeenCalledWith('/tabs/home');
        });
      });
    });

    describe('when there is no stored session', () => {
      it('does not navigate', async () => {
        await component.unlockClicked();
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      });
    });
  });

  describe('clicking the "Sign in" button', () => {
    it('performs the login', () => {
      component.signInClicked();
      expect(authentication.login).toHaveBeenCalledTimes(1);
    });

    it('passes the entered e-mail and password', () => {
      component.email = 'jimmy@test.org';
      component.password = 'I Crack the Corn';
      component.signInClicked();
      expect(authentication.login).toHaveBeenCalledWith('jimmy@test.org', 'I Crack the Corn');
    });

    describe('on success', () => {
      beforeEach(() => {
        authentication.login.and.returnValue(of(true));
        component.email = 'jimmy@test.org';
        component.password = 'I Crack the Corn';
      });

      it('clears the entered email and password', () => {
        component.signInClicked();
        expect(component.email).toBeFalsy();
        expect(component.password).toBeFalsy();
      });

      it('clears any existing error message', () => {
        component.errorMessage = 'failed to log in';
        component.signInClicked();
        expect(component.errorMessage).toBeFalsy();
      });

      it('navigates to the main page', () => {
        component.signInClicked();
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith('/tabs/home');
      });
    });

    describe('on failure', () => {
      beforeEach(() => {
        authentication.login.and.returnValue(of(false));
        component.email = 'jimmy@test.org';
        component.password = 'I Crack the Corn';
      });

      it('clears just the password', () => {
        component.signInClicked();
        expect(component.email).toEqual('jimmy@test.org');
        expect(component.password).toBeFalsy();
      });

      it('displays an error message', () => {
        component.signInClicked();
        expect(component.errorMessage).toEqual('Invalid e-mail address or password');
      });

      it('does not navigate', () => {
        component.signInClicked();
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      });
    });
  });
});
