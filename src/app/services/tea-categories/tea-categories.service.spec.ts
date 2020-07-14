import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TeaCategory } from '../../models/tea-category';
import { TeaCategoriesService } from './tea-categories.service';

import { deepCopy } from '../../../../test/util';
import { environment } from '../../../environments/environment';
import { testTeaCategories } from './tea-categories.test-data';

describe('TeaCategoriesService', () => {
  let httpTestingController: HttpTestingController;
  let teaCategoriesService: TeaCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeaCategoriesService],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(inject([TeaCategoriesService], (service: TeaCategoriesService) => {
    teaCategoriesService = service;
  }));

  it('should exists', () => {
    expect(teaCategoriesService).toBeTruthy();
  });

  describe('get all', () => {
    let categories: Array<TeaCategory>;
    beforeEach(() => {
      categories = deepCopy(testTeaCategories);
    });

    it('gets all of the tea categories', () => {
      teaCategoriesService
        .getAll()
        .subscribe(c => expect(c).toEqual(testTeaCategories));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/tea-categories`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(categories);
      httpTestingController.verify();
    });
  });

  describe('get', () => {
    let categories: Array<TeaCategory>;
    beforeEach(() => {
      categories = deepCopy(testTeaCategories);
    });

    it('gets a specific tea category', () => {
      teaCategoriesService
        .get(3)
        .subscribe(c => expect(c).toEqual(testTeaCategories[2]));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/tea-categories/3`,
      );
      expect(req.request.method).toEqual('GET');
      req.flush(categories[2]);
      httpTestingController.verify();
    });
  });

  describe('save', () => {
    let categories: Array<TeaCategory>;
    beforeEach(() => {
      categories = deepCopy(testTeaCategories);
    });

    it('saves the specified tea category', () => {
      teaCategoriesService
        .save(testTeaCategories[3])
        .subscribe(c => expect(c).toEqual(testTeaCategories[3]));
      const req = httpTestingController.expectOne(
        `${environment.dataService}/tea-categories/4`,
      );
      expect(req.request.method).toEqual('POST');
      req.flush(testTeaCategories[3]);
      httpTestingController.verify();
    });
  });
});
