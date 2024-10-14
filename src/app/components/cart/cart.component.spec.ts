import { NO_ERRORS_SCHEMA } from '@angular/core'
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick
} from '@angular/core/testing'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute } from '@angular/router'
import { MemoizedSelector } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { of } from 'rxjs'
import { CartItem } from '../../models/cart.model'
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity
} from '../../state/cart/cart.selectors'
import { CartComponent } from './cart.component'

describe('CartComponent', () => {
  let component: CartComponent
  let fixture: ComponentFixture<CartComponent>
  let store: MockStore
  let mockSelectCartItemsSelector: MemoizedSelector<any, CartItem[]>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartComponent, BrowserAnimationsModule, MatSnackBarModule],
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
    store.overrideSelector(selectCartTotalQuantity, 10)
    store.overrideSelector(selectCartTotalPrice, 10)
    mockSelectCartItemsSelector = store.overrideSelector(selectCartItems, [])
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it(
    'should render the correct number of app-cart-item components',
    fakeAsync(() => {
        const mockItems: CartItem[] = [
          {
            product: {
              id: '1',
              name: 'Red apples',
              img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              availableAmount: 5,
              minOrderAmount: 1,
              price: 10.5
            },
            quantity: 2
          },
          {
            product: {
              id: '2',
              name: 'Bananas',
              img: 'https://images.pexels.com/photos/461208/pexels-photo-461208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              availableAmount: 3,
              minOrderAmount: 1,
              price: 5
            },
            quantity: 3
          }
        ]
        mockSelectCartItemsSelector.setResult(mockItems)
        store.refreshState()
        tick(1000)
        fixture.detectChanges()

        const cartItems = fixture
          .debugElement
          .queryAll(By.css('app-cart-item'))

        expect(cartItems.length).toBe(2)
        flush()
      }
    )
  )

  it(
    'should show empty container when cart has no items',
    fakeAsync(() => {
      mockSelectCartItemsSelector.setResult([])
      store.refreshState()
      tick(1000)
      fixture.detectChanges()

      const empty = fixture
        .debugElement
        .query(By.css('div.empty-cart'))
        ?.nativeElement

      expect(empty).toBeTruthy()
      expect(empty.innerText).toContain(
        'It looks like you don\'t have any products in you cart.'
      )
      flush()
    })
  )
})
