import { NO_ERRORS_SCHEMA } from '@angular/core'
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute } from '@angular/router'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { of } from 'rxjs'
import { CartItem } from '../../models/cart.model'
import { CartActions } from '../../state/cart/cart.actions'
import { selectCartItems } from '../../state/cart/cart.selectors'
import { CartComponent } from './cart.component'

describe('CartComponent', () => {
  let component: CartComponent
  let fixture: ComponentFixture<CartComponent>
  let store: MockStore
  let snackBar: MatSnackBar

  const initialState = { cart: [] }

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [CartComponent, BrowserAnimationsModule, MatSnackBarModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: MatSnackBar,
          useValue: {
            open: jasmine.createSpy('open')
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
            paramMap: of({ get: () => null })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(CartComponent)
    component = fixture.componentInstance
    store = TestBed.inject(MockStore)
    snackBar = TestBed.inject(MatSnackBar)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should set hasProducts to true when cart has items', fakeAsync(() => {
    const mockCartItems: CartItem[] = [
      {
        product: {
          'id': '1',
          'name': 'Red apples',
          'img': 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          'availableAmount': 5,
          'minOrderAmount': 1,
          'price': 10.5
        },
        quantity: 2
      }
    ]
    store.overrideSelector(selectCartItems, mockCartItems)
    store.refreshState()
    component.ngOnInit()
    fixture.detectChanges()
    tick(3000)
    expect(component.hasProducts).toBeTrue()
  }))

  it(
    'should dispatch incrementQuantity action when increment is called',
    () => {
      const spy = spyOn(store, 'dispatch')
      const mockItem: CartItem = {
        product: {
          'id': '1',
          'name': 'Red apples',
          'img': 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          'availableAmount': 5,
          'minOrderAmount': 10,
          'price': 10.5
        },
        quantity: 2
      }

      component.increment(mockItem)
      fixture.detectChanges()

      expect(spy)
        .toHaveBeenCalledWith(CartActions.incrementQuantity({ productId: '1' }))
    }
  )

  it(
    'should show snackbar when increment is called with no available products',
    () => {
      const mockItem: CartItem = {
        product: {
          'id': '123',
          'name': 'Red apples',
          'img': 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          'availableAmount': 0,
          'minOrderAmount': 10,
          'price': 10.5
        },
        quantity: 100
      }

      const spy = spyOn(component, 'openSnackBar').and.callThrough()
      component.increment(mockItem)
      fixture.detectChanges()
      expect(spy).toHaveBeenCalledWith(
        'There are no more available products left!'
      )
    }
  )

  it(
    'should dispatch decrementQuantity action when decrement is called',
    () => {
      const spy = spyOn(store, 'dispatch')
      const mockItem: CartItem = {
        product: {
          'id': '1',
          'name': 'Red apples',
          'img': 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          'availableAmount': 100,
          'minOrderAmount': 10,
          'price': 10.5
        },
        quantity: 12
      }

      component.decrement(mockItem)
      fixture.detectChanges()

      expect(spy)
        .toHaveBeenCalledWith(CartActions.decrementQuantity({ productId: '1' }))
    }
  )

  it(
    'should show snackbar when decrement is called with minimum order amount reached',
    () => {
      const mockItem: CartItem = {
        product: {
          'id': '1',
          'name': 'Red apples',
          'img': 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          'availableAmount': 100,
          'minOrderAmount': 10,
          'price': 10.5
        },
        quantity: 10
      }

      const spy = spyOn(component, 'openSnackBar').and.callThrough()
      component.decrement(mockItem)
      fixture.detectChanges()
      expect(spy).toHaveBeenCalledWith(
        'Minimum order amount reached!'
      )
    }
  )

  it('should dispatch removeFromCart action when remove is called', () => {
    const spy = spyOn(store, 'dispatch')

    component.remove('1')
    fixture.detectChanges()

    expect(spy)
      .toHaveBeenCalledWith(CartActions.removeFromCart({ productId: '1' }))
  })
})
