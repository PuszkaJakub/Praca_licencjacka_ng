import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterPanelComponent } from './waiter-panel.component';

describe('WaiterPanelComponent', () => {
  let component: WaiterPanelComponent;
  let fixture: ComponentFixture<WaiterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
