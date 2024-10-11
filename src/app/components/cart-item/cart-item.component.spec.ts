import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { CartItemComponent } from './cart-item.component'

describe('CartItemComponent', () => {
  let component: CartItemComponent
  let fixture: ComponentFixture<CartItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [CartItemComponent]
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

  it('should emit increment event', () => {
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
    spyOn(component.inc, 'emit')

    fixture.detectChanges()

    const incrementButton = fixture
      .debugElement
      .query(By.css('div.quantity-control > button:last-child'))
      .nativeElement
    incrementButton.click()

    expect(component.inc.emit).toHaveBeenCalledWith(component.item)
  })

  it('should emit decrement event', () => {
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
    spyOn(component.dec, 'emit')

    fixture.detectChanges()

    const decrementButton = fixture
      .debugElement
      .query(By.css('div.quantity-control > button:first-child'))
      .nativeElement
    decrementButton.click()

    expect(component.dec.emit).toHaveBeenCalledWith(component.item)
  })
})
