import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenPanelComponent } from './kitchen-panel.component';

describe('KitchenPanelComponent', () => {
  let component: KitchenPanelComponent;
  let fixture: ComponentFixture<KitchenPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitchenPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
