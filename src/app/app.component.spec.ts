import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, RouterOutlet } from '@angular/router'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { AppComponent } from './app.component'
import { CartComponent } from './components/cart/cart.component'
import {
  NavigationComponent
} from './components/navigation/navigation.component'
import { ProductsComponent } from './components/products/products.component'
import { WelcomeComponent } from './components/welcome/welcome.component'
import { CartActions } from './state/cart/cart.actions'

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let store: MockStore

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, NavigationComponent, BrowserAnimationsModule],
      providers: [
        provideMockStore(),
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

  // it('should call getProducts on productsService during ngOnInit', () => {
  //   component.ngOnInit()
  //   expect(productsServiceSpy.getProducts).toHaveBeenCalled()
  // })

  it('should dispatch initializeCart action with products', () => {
    component.ngOnInit()
    expect(store.dispatch)
      .toHaveBeenCalledWith(CartActions.initializeCart({ products: [] }))
  })

  it('should prepare route animation data correctly', () => {
    const outlet = { activatedRouteData: { animation: 'testAnimation' } } as unknown as RouterOutlet
    const animationData = component.prepareRoute(outlet)
    expect(animationData).toBe('testAnimation')
  })
})
