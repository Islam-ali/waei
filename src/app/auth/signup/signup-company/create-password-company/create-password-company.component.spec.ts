import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePasswordCompanyComponent } from './create-password-company.component';

describe('CreatePasswordComponent', () => {
  let component: CreatePasswordCompanyComponent;
  let fixture: ComponentFixture<CreatePasswordCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePasswordCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePasswordCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
