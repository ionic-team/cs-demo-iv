import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { TeaCategory } from '../../models/tea-category';

@Injectable({
  providedIn: 'root',
})
export class TeaCategoriesService {
  changed: Subject<void>;

  constructor(private http: HttpClient) {
    this.changed = new Subject();
  }

  getAll(): Observable<Array<TeaCategory>> {
    return this.http.get<Array<TeaCategory>>(
      `${environment.dataService}/tea-categories`,
    );
  }

  get(id: number): Observable<TeaCategory> {
    return this.http.get<TeaCategory>(
      `${environment.dataService}/tea-categories/${id}`,
    );
  }

  save(teaCategory: TeaCategory): Observable<TeaCategory> {
    return this.http
      .post<TeaCategory>(
        `${environment.dataService}/tea-categories/${teaCategory.id}`,
        teaCategory,
      )
      .pipe(tap(() => this.changed.next()));
  }
}
