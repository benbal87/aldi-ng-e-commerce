import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, RouterOutlet } from '@angular/router'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { of } from 'rxjs'
import { AppComponent } from './app.component'
import { CartComponent } from './components/cart/cart.component'
import {
  NavigationComponent
} from './components/navigation/navigation.component'
import { ProductsComponent } from './components/products/products.component'
import { WelcomeComponent } from './components/welcome/welcome.component'
import { ProductsService } from './services/products.service'
import { CartActions } from './state/cart/cart.actions'

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let store: MockStore
  let productsServiceSpy: jasmine.SpyObj<ProductsService>

  beforeEach(async () => {
    const productsServiceMock = jasmine.createSpyObj(
      'ProductsService',
      ['getProducts']
    )
    productsServiceMock.getProducts.and.returnValue(of([
      {
        id: '2',
        name: 'Bananas',
        img: 'https://dm.cms.aldi.cx/is/image/prod1amer/product/jpg/scaleWidth/306/10a4bf7d-f74f-4c37-ab27-2f7773c81039/Bananas%20%20%20per%20lb',
        availableAmount: 150,
        minOrderAmount: 5,
        price: 1
      }
    ]))

    await TestBed.configureTestingModule({
      imports: [AppComponent, NavigationComponent, BrowserAnimationsModule],
      providers: [
        provideMockStore(),
        {
          provide: ProductsService,
          useValue: productsServiceMock
        },
        provideRouter([
          { path: 'welcome', component: WelcomeComponent },
          { path: 'products', component: ProductsComponent },
          { path: 'cart', component: CartComponent }
        ])
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    store = TestBed.inject(MockStore)
    productsServiceSpy
      = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>
    spyOn(store, 'dispatch')
  })

  it('should create the app component', () => {
    expect(component).toBeTruthy()
  })

  it('should have a navigation component', () => {
    const navElement = fixture.debugElement.query(By.directive(
      NavigationComponent))
    expect(navElement).not.toBeNull()
  })

  it('should call getProducts on productsService during ngOnInit', () => {
    component.ngOnInit()
    expect(productsServiceSpy.getProducts).toHaveBeenCalled()
  })

  it('should dispatch initializeCart action with products', () => {
    component.ngOnInit()
    expect(store.dispatch)
      .toHaveBeenCalledWith(CartActions.initializeCart({
        products: [
          {
            id: '2',
            name: 'Bananas',
            img: 'https://dm.cms.aldi.cx/is/image/prod1amer/product/jpg/scaleWidth/306/10a4bf7d-f74f-4c37-ab27-2f7773c81039/Bananas%20%20%20per%20lb',
            availableAmount: 150,
            minOrderAmount: 5,
            price: 1
          }
        ]
      }))
  })

  it('should prepare route animation data correctly', () => {
    const outlet = { activatedRouteData: { animation: 'testAnimation' } } as unknown as RouterOutlet
    const animationData = component.prepareRoute(outlet)
    expect(animationData).toBe('testAnimation')
  })
})
