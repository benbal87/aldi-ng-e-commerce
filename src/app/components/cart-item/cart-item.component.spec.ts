import { ComponentFixture, TestBed } from '@angular/core/testing'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { By } from '@angular/platform-browser'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { CartActions } from '../../state/cart/cart.actions'
import { CartItemComponent } from './cart-item.component'

describe('CartItemComponent', () => {
  let component: CartItemComponent
  let fixture: ComponentFixture<CartItemComponent>
  let store: MockStore
  let snackBar: MatSnackBar

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [CartItemComponent, MatSnackBarModule],
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
          }),
          {
            provide: MatSnackBar,
            useValue: {
              open: jasmine.createSpy('open')
            }
          }
        ]
      })
      .compileComponents()

    fixture = TestBed.createComponent(CartItemComponent)
    component = fixture.componentInstance
    component.item = {
      product: {
        id: '1',
        name: 'Red apples',
        img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        availableAmount: 5,
        minOrderAmount: 1,
        price: 10.5
      },
      quantity: 3
    }
    store = TestBed.inject(MockStore)
    snackBar = TestBed.inject(MatSnackBar)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render the product name', () => {
    const productName = fixture
      .debugElement
      .query(By.css('div.product-data > div.details strong'))
      .nativeElement
    expect(productName.textContent).toContain('Red Apples')
  })

  it('should render the product price', () => {
    const productPrice = fixture
      .debugElement
      .query(By.css('div.price > strong'))
      .nativeElement
    expect(productPrice.textContent).toContain('10.5')
  })

  it('should set the correct image src for the product', () => {
    const productImage = fixture
      .debugElement
      .query(By.css('div.product-data > img'))
      .nativeElement
    expect(productImage.src).toBe(
      'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')
  })

  it(
    'should dispatch CartActions.incrementQuantity action when increment ' +
    'button is clicked with availableAmount=5 and quantity=2',
    () => {
      const spy = spyOn(store, 'dispatch')
      component.item = {
        product: {
          id: '1',
          name: 'Red apples',
          img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          availableAmount: 5,
          minOrderAmount: 10,
          price: 10.5
        },
        quantity: 2
      }
      component.handleIncrement()
      fixture.detectChanges()

      const button = fixture
        .debugElement
        .query(By.css('div.quantity-control button:last-child'))
        ?.nativeElement

      expect(button).toBeTruthy()

      expect(spy).toHaveBeenCalledWith(
        CartActions.incrementQuantity({ productId: '1' })
      )
    }
  )

  it(
    'should show snackbar notification when increment button is clicked ' +
    'with no available products, availableAmount=0 and quantity=100',
    () => {
      const spy = spyOn(component, 'openSnackBar').and.callThrough()
      component.item = {
        product: {
          id: '123',
          name: 'Red apples',
          img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          availableAmount: 0,
          minOrderAmount: 10,
          price: 10.5
        },
        quantity: 100
      }
      component.handleIncrement()
      fixture.detectChanges()

      const button = fixture
        .debugElement
        .query(By.css('div.quantity-control button:last-child'))
        ?.nativeElement

      expect(button).toBeTruthy()

      button?.click()

      expect(spy).toHaveBeenCalledWith(
        'There are no more available products left!'
      )
    }
  )

  it(
    'should dispatch CartActions.decrementQuantity action when decrement ' +
    'button is clicked with availableAmount=100 and quantity=12',
    () => {
      const spy = spyOn(store, 'dispatch')
      component.item = {
        product: {
          id: '1',
          name: 'Red apples',
          img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          availableAmount: 100,
          minOrderAmount: 10,
          price: 10.5
        },
        quantity: 12
      }
      component.handleDecrement()
      fixture.detectChanges()

      const button = fixture
        .debugElement
        .query(By.css('div.quantity-control button:first-child'))
        ?.nativeElement

      expect(button).toBeTruthy()

      button?.click()

      expect(spy).toHaveBeenCalledWith(
        CartActions.decrementQuantity({ productId: '1' })
      )
    }
  )

  it(
    'should show snackbar notification when decrement button is clicked ' +
    'with minimum order amount reached',
    () => {
      const spy = spyOn(component, 'openSnackBar').and.callThrough()
      component.item = {
        product: {
          id: '1',
          name: 'Red apples',
          img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          availableAmount: 100,
          minOrderAmount: 10,
          price: 10.5
        },
        quantity: 10
      }
      component.handleDecrement()
      fixture.detectChanges()

      const button = fixture
        .debugElement
        .query(By.css('div.quantity-control button:first-child'))
        ?.nativeElement

      expect(button).toBeTruthy()

      button?.click()

      expect(spy).toHaveBeenCalledWith(
        'Minimum order amount reached!'
      )
    }
  )

  it('should dispatch removeFromCart action when remove is clicked', () => {
    const spy = spyOn(store, 'dispatch')
    component.item = {
      product: {
        id: '1',
        name: 'Red apples',
        img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        availableAmount: 100,
        minOrderAmount: 10,
        price: 10.5
      },
      quantity: 10
    }
    component.handleRemove()
    fixture.detectChanges()

    expect(spy).toHaveBeenCalledWith(
      CartActions.removeFromCart({ productId: '1' })
    )
  })
})
