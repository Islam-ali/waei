import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSourceComponent } from './select-source.component';

describe('SelectSourceComponent', () => {
  let component: SelectSourceComponent;
  let fixture: ComponentFixture<SelectSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
