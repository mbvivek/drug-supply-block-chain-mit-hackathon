import { TestBed, inject } from '@angular/core/testing';

import { MedicationService } from './medication.service';

describe('MedicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MedicationService]
    });
  });

  it('should be created', inject([MedicationService], (service: MedicationService) => {
    expect(service).toBeTruthy();
  }));
});
