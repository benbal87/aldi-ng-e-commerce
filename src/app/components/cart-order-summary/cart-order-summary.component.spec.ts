import { DebugElement } from '@angular/core'
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import {
  selectCartTotalPrice,
  selectCartTotalQuantity
} from '../../state/cart/cart.selectors'

import { CartOrderSummaryComponent } from './cart-order-summary.component'

describe('CartOrderSummaryComponent', () => {
  let component: CartOrderSummaryComponent
  let fixture: ComponentFixture<CartOrderSummaryComponent>
  let store: MockStore

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [CartOrderSummaryComponent, BrowserAnimationsModule],
        providers: [
          provideMockStore({
            initialState: {
              cart: {
                cart: []
              },
              products: {
                products: []
              }
            }
          })
        ]
      })
      .compileComponents()

    fixture = TestBed.createComponent(CartOrderSummaryComponent)
    component = fixture.componentInstance
    store = TestBed.inject(MockStore)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize with default values', () => {
    expect(component.promoCode).toBe('')
    expect(component.shippingCost).toBe(50)
  })

  it('should display total quantity and total price', fakeAsync(() => {
    store.overrideSelector(selectCartTotalQuantity, 3)
    store.overrideSelector(selectCartTotalPrice, 100)
    store.refreshState()
    component.ngOnInit()
    fixture.detectChanges()

    const totalQuantityElement: DebugElement = fixture
      .debugElement
      .query(By.css('mat-card-content p:first-child'))
    const totalPriceElement: DebugElement = fixture
      .debugElement
      .query(By.css('mat-card-footer p:first-child'))

    expect(totalQuantityElement.nativeElement.textContent).toContain('3')
    expect(totalPriceElement.nativeElement.textContent).toContain('150')
  }))

  it('should call applyPromoCode method if promo code provided', () => {
    component.promoCode = 'sj4rg9gZm2Z'
    spyOn(component, 'applyPromoCode')
    fixture.detectChanges()
    const button = fixture
      .debugElement
      .query(By.css('mat-form-field button'))
      .nativeElement
    button.click()

    expect(button.disabled).toBeFalse()
    expect(component.applyPromoCode).toHaveBeenCalled()
  })

  it('should not call applyPromoCode method if promo code not provided', () => {
    spyOn(component, 'applyPromoCode')
    fixture.detectChanges()
    const button = fixture
      .debugElement
      .query(By.css('mat-form-field button'))
      .nativeElement
    button.click()

    expect(button.disabled).toBeTrue()
    expect(component.applyPromoCode).not.toHaveBeenCalled()
  })

  it('should call checkout method', () => {
    spyOn(component, 'checkout')
    const button = fixture
      .debugElement
      .query(By.css('mat-card-actions button'))
      .nativeElement
    button.click()

    expect(component.checkout).toHaveBeenCalled()
  })
})
