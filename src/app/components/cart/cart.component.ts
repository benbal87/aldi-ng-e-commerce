import { CommonModule, NgOptimizedImage } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatDivider } from '@angular/material/divider'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule, MatLabel } from '@angular/material/input'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTooltip } from '@angular/material/tooltip'
import { RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable, tap } from 'rxjs'
import { CartItem } from '../../models/cart.model'
import { CartActions } from '../../state/cart/cart.actions'
import { selectCartItems } from '../../state/cart/cart.selectors'
import { CartItemComponent } from '../cart-item/cart-item.component'
import {
  CartOrderSummaryComponent
} from '../cart-order-summary/cart-order-summary.component'

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatLabel,
    RouterLink,
    MatDivider,
    FormsModule,
    NgOptimizedImage,
    MatTooltip,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    CartItemComponent,
    CartOrderSummaryComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cart$!: Observable<CartItem[]>
  hasProducts: boolean = false

  constructor(private store: Store, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.cart$ = this.store.select(selectCartItems)
      .pipe(
        tap((products: CartItem[]): void => {
            this.hasProducts = products.length > 0
          }
        )
      )
  }

  increment(item: CartItem): void {
    if (item.product.availableAmount >= 1) {
      this.store.dispatch(
        CartActions.incrementQuantity({ productId: item.product.id })
      )
    } else {
      this.snackBar.open(
        'There are no more available products left!',
        'Close',
        {
          duration: 3000
        }
      )
    }
  }

  decrement(item: CartItem): void {
    if (item.quantity - 1 >= item.product.minOrderAmount) {
      this.store.dispatch(
        CartActions.decrementQuantity({ productId: item.product.id })
      )
    } else {
      this.snackBar.open(
        'Minimum order amount reached!',
        'Close',
        {
          duration: 3000
        }
      )
    }
  }

  remove(productId: string) {
    this.store.dispatch(CartActions.removeFromCart({ productId }))
  }
}
