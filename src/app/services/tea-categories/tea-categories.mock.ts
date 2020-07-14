import { of, Subject } from 'rxjs';

export function createTeaCategoriesServiceMock() {
  const mock = jasmine.createSpyObj('TeaCategoriesService', {
    getAll: of([]),
    get: of({}),
    save: of({}),
  });
  mock.changed = new Subject();
  return mock;
}
