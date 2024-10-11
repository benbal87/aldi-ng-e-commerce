import { DebugElement } from '@angular/core'
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick
} from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { Product } from '../../models/product.model'
import { ProductsService } from '../../services/products.service'
import { selectAllProducts } from '../../state/cart/cart.selectors'
import { ProductsComponent } from './products.component'

describe('ProductsComponent', () => {
  let component: ProductsComponent
  let fixture: ComponentFixture<ProductsComponent>
  let productService: jasmine.SpyObj<ProductsService>
  let store: MockStore

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj(
      'ProductsService',
      ['getProducts']
    )

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: ProductsService,
          useValue: productServiceSpy
        },
        provideMockStore()
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(ProductsComponent)
    component = fixture.componentInstance
    store = TestBed.inject(MockStore)
    productService
      = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>
  })

  afterEach(() => {
    fixture.destroy()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should call getProducts on init and populate products', () => {
    const mockProducts: Product[] = [
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
    ]

    store.overrideSelector(selectAllProducts, mockProducts)
    store.refreshState()

    component.ngOnInit()

    component.products$.subscribe(products =>
      expect(products.length).toBe(2))
    component.products$.subscribe(products =>
      expect(products).toEqual(mockProducts))
  })

  it('should display products in the template', fakeAsync(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Red apples',
        img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        availableAmount: 5,
        minOrderAmount: 1,
        price: 10.5
      },
      {
        id: '2',
        name: 'Bananas',
        img: 'https://dm.cms.aldi.cx/is/image/prod1amer/product/jpg/scaleWidth/306/10a4bf7d-f74f-4c37-ab27-2f7773c81039/Bananas%20%20%20per%20lb',
        availableAmount: 150,
        minOrderAmount: 5,
        price: 1
      }
    ]

    store.overrideSelector(selectAllProducts, mockProducts)
    store.refreshState()
    component.ngOnInit()
    tick()
    fixture.detectChanges()

    const productElements: DebugElement[] =
      fixture.debugElement.queryAll(By.css('app-products-item'))
    expect(productElements.length).toBe(2)
    expect(productElements[0].nativeElement.textContent)
      .toContain('Red apples')
    expect(productElements[1].nativeElement.textContent)
      .toContain('Bananas')
    flush()
  }))

  it('should handle empty product list gracefully', fakeAsync(() => {
    store.overrideSelector(selectAllProducts, [])
    store.refreshState()
    component.ngOnInit()
    tick()
    fixture.detectChanges()

    const productElements: DebugElement[] =
      fixture.debugElement.queryAll(By.css('app-products-item'))
    expect(productElements.length).toBe(0)

    const noProductsMessage: DebugElement =
      fixture.debugElement.query(By.css('.no-products'))
    expect(noProductsMessage).toBeTruthy()
  }))
})
