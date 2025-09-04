import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRegistrationComponent } from './company-registration.component';

describe('CompanyRegistrationComponent', () => {
  let component: CompanyRegistrationComponent;
  let fixture: ComponentFixture<CompanyRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
