import { of } from 'rxjs';

export function createAuthenticationServiceMock() {
  return jasmine.createSpyObj('AuthenticationService', {
    login: of(false),
    logout: of(null),
  });
}
