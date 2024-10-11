import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick
} from '@angular/core/testing'
import { MatBadgeModule } from '@angular/material/badge'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { By } from '@angular/platform-browser'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { RouterTestingHarness } from '@angular/router/testing'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { BadgeDirective } from '../../directives/badge.directive'
import { selectCartTotalQuantity } from '../../state/cart/cart.selectors'
import { BadgeComponent } from '../badge/badge.component'
import { CartComponent } from '../cart/cart.component'
import { ProductsComponent } from '../products/products.component'
import { WelcomeComponent } from '../welcome/welcome.component'

import { NavigationComponent } from './navigation.component'

describe('NavigationComponent', () => {
  let component: NavigationComponent
  let fixture: ComponentFixture<NavigationComponent>
  let store: MockStore
  let harness: RouterTestingHarness

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
          NavigationComponent,
          BadgeComponent,
          BadgeDirective,
          MatButtonModule,
          MatIconModule,
          MatBadgeModule,
          NoopAnimationsModule,
          NavigationComponent
        ],
        providers: [
          provideMockStore({ initialState: { cart: [] } }),
          provideRouter([
            { path: 'welcome', component: WelcomeComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'cart', component: CartComponent }
          ])
        ]
      })
      .compileComponents()

    fixture = TestBed.createComponent(NavigationComponent)
    component = fixture.componentInstance
    store = TestBed.inject(MockStore)
    harness = await RouterTestingHarness.create()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it(
    'should navigate to /welcome when the welcome button is clicked',
    async () => {
      await harness.navigateByUrl(
        '/welcome',
        WelcomeComponent
      )

      const heading = harness
        .routeNativeElement
        ?.textContent
      expect(heading).toContain('Welcome to this technical assessment task!')
    }
  )

  it(
    'should navigate to /products when the products button is clicked',
    async () => {
      await harness.navigateByUrl(
        '/products',
        ProductsComponent
      )

      fixture.detectChanges()
      const heading = harness
        .routeNativeElement
        ?.textContent
      expect(heading).toContain('Items per page: 50 0 of 0')
    }
  )

  it('should navigate to /cart when the cart button is clicked', async () => {
    await harness.navigateByUrl('/cart', CartComponent)
    const heading =
      harness.routeNativeElement?.textContent
    expect(heading).toContain(
      'It looks like you don\'t have any products in you cart.'
    )
  })

  it(
    'should show number of cart items if items added to cart',
    fakeAsync(() => {
      store.overrideSelector(selectCartTotalQuantity, 3)
      store.refreshState()
      component.ngOnInit()
      tick(1000)
      fixture.detectChanges()

      const stable = async () => {
        return await fixture.whenStable()
      }
      stable()

      tick(1000)
      fixture.detectChanges()

      const badge = fixture
        .debugElement
        .query(By.css('span.badge-content'))
        ?.nativeElement

      expect(badge).toBeTruthy()
      expect(badge?.textContent).toContain('3')

      flush()
    })
  )

  it(
    'should not show number of cart items if items added to cart',
    fakeAsync(() => {
      store.overrideSelector(selectCartTotalQuantity, 0)
      store.refreshState()
      component.ngOnInit()
      tick(1000)
      fixture.detectChanges()

      const stable = async () => {
        return await fixture.whenStable()
      }
      stable()

      tick(1000)
      fixture.detectChanges()

      const badge = fixture
        .debugElement
        .query(By.css('span.badge-content'))
        ?.nativeElement

      expect(badge).toBeUndefined()

      flush()
    })
  )
})
