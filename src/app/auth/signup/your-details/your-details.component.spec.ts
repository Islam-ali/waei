import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourDetailsComponent } from './your-details.component';

describe('YourDetailsComponent', () => {
  let component: YourDetailsComponent;
  let fixture: ComponentFixture<YourDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
