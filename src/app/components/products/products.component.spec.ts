import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MemoizedSelector } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { Product } from '../../models/product.model'
import {
  selectAllProducts,
  selectProductsError,
  selectProductsIsLoading
} from '../../state/products/products.selector'
import { ProductsComponent } from './products.component'

describe('ProductsComponent', () => {
  let component: ProductsComponent
  let fixture: ComponentFixture<ProductsComponent>
  let store: MockStore
  let selectAllProductsMock: MemoizedSelector<any, Product[]>
  let selectProductsIsLoadingMock: MemoizedSelector<any, boolean>
  let selectProductsErrorMock: MemoizedSelector<any, string | null>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent, BrowserAnimationsModule],
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
    }).compileComponents()

    fixture = TestBed.createComponent(ProductsComponent)
    component = fixture.componentInstance
    component.pageStartItemIndex = 0
    component.pageEndItemIndex = 5
    component.pageSize = 5
    component.pageIndex = 0
    store = TestBed.inject(MockStore)
    selectAllProductsMock =
      store.overrideSelector(selectAllProducts, [])
    selectProductsIsLoadingMock =
      store.overrideSelector(selectProductsIsLoading, true)
    selectProductsErrorMock =
      store.overrideSelector(selectProductsError, null)
    store.refreshState()
    fixture.detectChanges()
  })

  afterEach(() => {
    fixture.destroy()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it(
    'should render products when no error and loading false and ' +
    'products provided and arrived',
    () => {
      selectAllProductsMock.setResult([
        {
          id: '1',
          name: 'Red apples',
          img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          availableAmount: 5,
          minOrderAmount: 1,
          price: 10.5
        }, {
          id: '2',
          name: 'Bananas',
          img: 'https://dm.cms.aldi.cx/is/image/prod1amer/product/jpg/scaleWidth/306/10a4bf7d-f74f-4c37-ab27-2f7773c81039/Bananas%20%20%20per%20lb',
          availableAmount: 150,
          minOrderAmount: 5,
          price: 1
        }
      ])
      selectProductsIsLoadingMock.setResult(false)
      selectProductsErrorMock.setResult(null)
      store.refreshState()
      fixture.detectChanges()

      const products = fixture
        .debugElement
        .queryAll(By.css('app-products-item'))

      expect(products.length).toBe(2)
    }
  )

  it(
    'should not show products and should show loading and no error ' +
    'when no error and no products provided and loading is true',
    () => {
      selectAllProductsMock.setResult([])
      selectProductsIsLoadingMock.setResult(true)
      selectProductsErrorMock.setResult(null)
      store.refreshState()
      fixture.detectChanges()

      const products = fixture
        .debugElement
        .queryAll(By.css('app-products-item'))

      expect(products.length).toBe(0)

      const spinner = fixture
        .debugElement
        .query(By.css('mat-spinner'))
        ?.nativeElement

      expect(spinner).toBeTruthy()
    }
  )

  it(
    'should not products and should show error when error is thrown',
    () => {
      selectAllProductsMock.setResult([
        {
          id: '1',
          name: 'Red apples',
          img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          availableAmount: 5,
          minOrderAmount: 1,
          price: 10.5
        }, {
          id: '2',
          name: 'Bananas',
          img: 'https://dm.cms.aldi.cx/is/image/prod1amer/product/jpg/scaleWidth/306/10a4bf7d-f74f-4c37-ab27-2f7773c81039/Bananas%20%20%20per%20lb',
          availableAmount: 150,
          minOrderAmount: 5,
          price: 1
        }
      ])
      selectProductsIsLoadingMock.setResult(true)
      selectProductsErrorMock.setResult('This is an Error!')
      store.refreshState()
      component.ngOnInit()
      fixture.detectChanges()

      const errorContainer = fixture
        .debugElement
        .query(By.css('mat-card-content'))
        ?.nativeElement

      expect(errorContainer.innerText).toContain('This is an Error!')
    }
  )
})
