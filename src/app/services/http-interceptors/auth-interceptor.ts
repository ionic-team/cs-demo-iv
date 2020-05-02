import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { IdentityService } from '../identity';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private identity: IdentityService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(
      this.requestRequiresToken(req)
        ? this.identity
            .getToken()
            .then((token) => {
              if (token) {
                req = req.clone({
                  setHeaders: {
                    Authorization: 'Bearer ' + token
                  }
                });
              }
            })
            .catch(() => Promise.resolve())
        : Promise.resolve()
    ).pipe(flatMap(() => next.handle(req)));
  }

  private requestRequiresToken(req: HttpRequest<any>): boolean {
    return !/\/login$/.test(req.url);
  }
}
