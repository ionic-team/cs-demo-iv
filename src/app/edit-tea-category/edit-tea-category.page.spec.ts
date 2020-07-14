import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';

import {
  createActivatedRouteMock,
  createNavControllerMock,
} from '../../../test/mocks';
import { EditTeaCategoryPage } from './edit-tea-category.page';
import {
  TeaCategoriesService,
  createTeaCategoriesServiceMock,
} from '../services/tea-categories';
import { of } from 'rxjs';

describe('EditTeaCategoryPage', () => {
  let component: EditTeaCategoryPage;
  let fixture: ComponentFixture<EditTeaCategoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditTeaCategoryPage],
      imports: [FormsModule, IonicModule],
      providers: [
        { provide: ActivatedRoute, useFactory: createActivatedRouteMock },
        { provide: NavController, useFactory: createNavControllerMock },
        {
          provide: TeaCategoriesService,
          useFactory: createTeaCategoriesServiceMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTeaCategoryPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('determines the ID from the route', () => {
      const route = TestBed.inject(ActivatedRoute);
      fixture.detectChanges();
      expect(route.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
      expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    });

    it('gets the category for the ID', () => {
      const route = TestBed.inject(ActivatedRoute);
      const cats = TestBed.inject(TeaCategoriesService);
      (route.snapshot.paramMap.get as any).and.returnValue('42');
      fixture.detectChanges();
      expect(cats.get).toHaveBeenCalledTimes(1);
      expect(cats.get).toHaveBeenCalledWith(42);
    });

    it('sets the name', () => {
      const route = TestBed.inject(ActivatedRoute);
      const cats = TestBed.inject(TeaCategoriesService);
      (route.snapshot.paramMap.get as any).and.returnValue('42');
      (cats.get as any).and.returnValue(
        of({
          id: 42,
          name: 'Doug',
          description: 'The long dark teamtime of the soul',
        }),
      );
      fixture.detectChanges();
      expect(component.name).toEqual('Doug');
    });

    it('sets the description', () => {
      const route = TestBed.inject(ActivatedRoute);
      const cats = TestBed.inject(TeaCategoriesService);
      (route.snapshot.paramMap.get as any).and.returnValue('42');
      (cats.get as any).and.returnValue(
        of({
          id: 42,
          name: 'Doug',
          description: 'The long dark teamtime of the soul',
        }),
      );
      fixture.detectChanges();
      expect(component.description).toEqual(
        'The long dark teamtime of the soul',
      );
    });
  });

  describe('save', () => {
    beforeEach(() => {
      const cats = TestBed.inject(TeaCategoriesService);
      (cats.get as any).and.returnValue(
        of({
          id: 42,
          name: 'Doug',
          description: 'The long dark teamtime of the soul',
        }),
      );
      fixture.detectChanges();
    });

    it('saves changes to the name and description', () => {
      const cats = TestBed.inject(TeaCategoriesService);
      component.name = 'Anthony';
      component.description = 'A clockwork orange pekoe';
      component.save();
      expect(cats.save).toHaveBeenCalledTimes(1);
      expect(cats.save).toHaveBeenCalledWith({
        id: 42,
        name: 'Anthony',
        description: 'A clockwork orange pekoe',
      });
    });

    it('navigates back home', () => {
      const nav = TestBed.inject(NavController);
      component.save();
      expect(nav.back).toHaveBeenCalledTimes(1);
    });
  });
});
