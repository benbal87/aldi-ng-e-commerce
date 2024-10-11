import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Product } from '../../models/product.model'

import { ProductsItemComponent } from './products-item.component'

describe('ProductsItemComponent', () => {
  let component: ProductsItemComponent
  let fixture: ComponentFixture<ProductsItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [ProductsItemComponent, BrowserAnimationsModule]
      })
      .compileComponents()

    fixture = TestBed.createComponent(ProductsItemComponent)
    component = fixture.componentInstance
    component.quantities = {
      '1': 1
    }
    component.product = {
      id: '1',
      name: 'Red apples',
      img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      availableAmount: 5,
      minOrderAmount: 1,
      price: 10.5
    }
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

  it('should render available amount', () => {
    const availableAmount = fixture
      .debugElement
      .query(By.css('mat-card-content p:last-child'))
      .nativeElement

    expect(availableAmount.textContent).toContain('5')
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
      component.quantities = {
        '1': 5
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
})
