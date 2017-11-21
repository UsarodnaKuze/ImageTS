import { TestBed, inject } from '@angular/core/testing';

import { FrameExtractorService } from './frame-extractor.service';

describe('FrameExtractorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrameExtractorService]
    });
  });

  it('should be created', inject([FrameExtractorService], (service: FrameExtractorService) => {
    expect(service).toBeTruthy();
  }));
});
