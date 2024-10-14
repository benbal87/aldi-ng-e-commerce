import { CurrencyPipe, NgOptimizedImage, TitleCasePipe } from '@angular/common'
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButton, MatIconButton } from '@angular/material/button'
import {
  MatCard,
  MatCardContent,
  MatCardImage,
  MatCardTitle
} from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTooltip } from '@angular/material/tooltip'
import { Store } from '@ngrx/store'
import { CartItem } from '../../models/cart.model'
import { CartActions } from '../../state/cart/cart.actions'

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardImage,
    MatCardTitle,
    MatIcon,
    MatIconButton,
    MatTooltip,
    NgOptimizedImage,
    TitleCasePipe,
    FormsModule
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent implements OnInit {

  @Input()
  item!: CartItem

  @ViewChild('quantityInput')
  quantityInput!: ElementRef

  quantity: number = 0

  constructor(private store: Store, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.quantity = this.item.quantity
  }

  getSnackBar(): MatSnackBar {
    return this.snackBar
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnterKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (
        ((this.item.product.availableAmount + this.item.quantity) >=
          this.quantity) &&
        (this.item.product.minOrderAmount <= this.quantity)
      ) {
        this.store.dispatch(CartActions.updateQuantity({
          productId: this.item.product.id,
          quantity: this.quantity
        }))
      } else {
        this.openSnackBar(
          'Please choose below the available quantity and above the minimal ' +
          'order amount!'
        )
        this.resetQuantityInput()
      }
    }
  }

  handleIncrement(): void {
    if (this.item.product.availableAmount >= 1) {
      this.store.dispatch(
        CartActions.incrementQuantity({ productId: this.item.product.id })
      )
    } else {
      this.openSnackBar('There are no more available products left!')
    }
  }

  handleDecrement(): void {
    if (this.item.quantity - 1 >= this.item.product.minOrderAmount) {
      this.store.dispatch(
        CartActions.decrementQuantity({ productId: this.item.product.id })
      )
    } else {
      this.openSnackBar('Minimum order amount reached!')
    }
  }

  handleRemove(): void {
    this.store.dispatch(CartActions.removeFromCart({
      productId: this.item.product.id
    }))
  }

  openSnackBar(message: string): void {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000
      }
    )
  }

  resetQuantityInput(): void {
    this.quantityInput.nativeElement.value = this.item.quantity
  }
}
