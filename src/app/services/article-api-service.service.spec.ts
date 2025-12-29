import { TestBed } from '@angular/core/testing';

import { ArticleApiServiceService } from './article-api-service.service';

describe('ArticleApiServiceService', () => {
  let service: ArticleApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
