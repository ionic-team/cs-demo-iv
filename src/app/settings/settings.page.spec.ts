import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPage } from './settings.page';
import { createAuthenticationServiceMock, AuthenticationService } from '../services/authentication';
import { createIdentityServiceMock, IdentityService } from '../services/identity';
import { SettingsService } from '../services/settings/settings.service';
import { createSettingsServiceMock } from '../services/settings/settings.mock';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthenticationService, useFactory: createAuthenticationServiceMock },
        { provide: IdentityService, useFactory: createIdentityServiceMock },
        { provide: SettingsService, useFactory: createSettingsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
