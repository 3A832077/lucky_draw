import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryWheelComponent } from './lottery-wheel.component';

describe('LotteryWheelComponent', () => {
  let component: LotteryWheelComponent;
  let fixture: ComponentFixture<LotteryWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LotteryWheelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotteryWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
