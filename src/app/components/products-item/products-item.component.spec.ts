import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MemoizedSelector } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { Product } from '../../models/product.model'
import {
  selectAvailableAmountOfCartItem
} from '../../state/cart/cart.selectors'

import { ProductsItemComponent } from './products-item.component'

describe('ProductsItemComponent', () => {
  let component: ProductsItemComponent
  let fixture: ComponentFixture<ProductsItemComponent>
  let store: MockStore
  let selectAvailableAmountOfCartItemMock: MemoizedSelector<any, number | undefined>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
          ProductsItemComponent,
          BrowserAnimationsModule
        ],
        providers: [
          provideMockStore({
            initialState: {
              cart: {
                cart: [
                  {
                    product: {
                      id: '1',
                      name: 'Red apples',
                      img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                      availableAmount: 8,
                      minOrderAmount: 1,
                      price: 10.5
                    },
                    quantity: 5
                  }
                ]
              },
              products: {
                products: []
              }
            }
          })
        ]
      })
      .compileComponents()

    fixture = TestBed.createComponent(ProductsItemComponent)
    component = fixture.componentInstance
    component.quantity = 3
    component.product = {
      id: '1',
      name: 'Red apples',
      img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      availableAmount: 5,
      minOrderAmount: 1,
      price: 10.5
    }
    store = TestBed.inject(MockStore)
    selectAvailableAmountOfCartItemMock =
      store.overrideSelector(selectAvailableAmountOfCartItem('1'), 6)
    store.refreshState()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render product name', () => {
    const name = fixture
      .debugElement
      .query(By.css('mat-card-title'))
      .nativeElement

    expect(name.textContent).toContain('Red apples')
  })

  it('should render product image', () => {
    const img = fixture
      .debugElement
      .query(By.css('div.img-container > img.responsive-image'))
      .nativeElement

    expect(img.src).toContain(
      'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')
  })

  it('should render product price', () => {
    const price = fixture
      .debugElement
      .query(By.css('mat-card-content p:first-child'))
      .nativeElement

    expect(price.textContent).toContain('10.5')
  })

  it(
    'should call addToCart method when the button is clicked if available ' +
    'amount of the product is not null and the available amount is smaller ' +
    'than the quantity of the product set in the number input to be put ' +
    'in the cart',
    () => {
      spyOn(component, 'handleAddToCart')
      fixture.detectChanges()

      const button = fixture
        .debugElement
        .query(By.css('mat-card-actions button'))
        .nativeElement
      button.click()

      expect(button.disabled).toBeFalse()
      expect(component.handleAddToCart).toHaveBeenCalledWith(
        {
          id: '1',
          name: 'Red apples',
          img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          availableAmount: 5,
          minOrderAmount: 1,
          price: 10.5
        }
      )
    }
  )

  it(
    'should not call addToCart method when the button is clicked if ' +
    'available amount of the product is zero',
    () => {
      const productWithZeroAvailableAmount: Product = {
        id: '1',
        name: 'Red apples',
        img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        availableAmount: 0,
        minOrderAmount: 1,
        price: 10.5
      }
      component.product = productWithZeroAvailableAmount

      spyOn(component, 'handleAddToCart')
      fixture.detectChanges()

      const button = fixture
        .debugElement
        .query(By.css('mat-card-actions button'))
        .nativeElement
      button.click()

      expect(button.disabled).toBeTrue()
      expect(component.handleAddToCart).not.toHaveBeenCalledWith(
        productWithZeroAvailableAmount
      )
    }
  )

  it(
    'should not call addToCart method when the button is clicked if ' +
    'available amount of the product less then the quantity of the product ' +
    'set to put in the cart',
    () => {
      const productWithZeroAvailableAmount: Product = {
        id: '1',
        name: 'Red apples',
        img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        availableAmount: 4,
        minOrderAmount: 1,
        price: 10.5
      }
      component.quantity = 5
      component.product = productWithZeroAvailableAmount

      spyOn(component, 'handleAddToCart')
      fixture.detectChanges()

      const button = fixture
        .debugElement
        .query(By.css('mat-card-actions button'))
        .nativeElement
      button.click()

      expect(button.disabled).toBeTrue()
      expect(component.handleAddToCart).not.toHaveBeenCalledWith(
        productWithZeroAvailableAmount
      )
    }
  )

  it(
    'should show available amount in cart instead of the available amount ' +
    'originally in the product',
    () => {
      const productWithZeroAvailableAmount: Product = {
        id: '1',
        name: 'Red apples',
        img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        availableAmount: 7,
        minOrderAmount: 1,
        price: 10.5
      }
      component.quantity = 5
      component.product = productWithZeroAvailableAmount

      fixture.detectChanges()

      const availableAmount = fixture
        .debugElement
        .query(By.css('mat-card-content p:last-child'))
        ?.nativeElement

      expect(availableAmount.innerText).toContain('Available Amount: 8')
    }
  )

  it(
    'should show available amount in the product instead of the available ' +
    'amount in the product is not in the cart',
    () => {
      const productWithZeroAvailableAmount: Product = {
        id: '1',
        name: 'Red apples',
        img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        availableAmount: 7,
        minOrderAmount: 1,
        price: 10.5
      }
      component.quantity = 5
      component.product = productWithZeroAvailableAmount

      store.setState({
        cart: {
          cart: []
        },
        products: {
          products: []
        }
      })

      fixture.detectChanges()

      const availableAmount = fixture
        .debugElement
        .query(By.css('mat-card-content p:last-child'))
        ?.nativeElement

      expect(availableAmount.innerText).toContain('Available Amount: 7')
    }
  )
})
