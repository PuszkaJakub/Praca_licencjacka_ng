import { TestBed } from '@angular/core/testing';

import { GraphhopperService } from './graphhopper.service';

describe('GraphhopperService', () => {
  let service: GraphhopperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphhopperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
