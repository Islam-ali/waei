import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameAndEmailComponent } from './username-and-email.component';

describe('UsernameAndEmailComponent', () => {
  let component: UsernameAndEmailComponent;
  let fixture: ComponentFixture<UsernameAndEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernameAndEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernameAndEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
