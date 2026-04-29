import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStockReactive } from './create-stock-reactive';

describe('CreateStockReactive', () => {
  let component: CreateStockReactive;
  let fixture: ComponentFixture<CreateStockReactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStockReactive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStockReactive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
