import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconButton } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormField } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput, MatLabel } from '@angular/material/input'
import { MatTooltip } from '@angular/material/tooltip'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { Product } from '../../models/product.model'
import { CartActions } from '../../state/cart/cart.actions'
import {
  selectAvailableAmountOfCartItem
} from '../../state/cart/cart.selectors'

@Component({
  selector: 'app-products-item',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatTooltip,
    NgOptimizedImage,
    AsyncPipe
  ],
  templateUrl: './products-item.component.html',
  styleUrl: './products-item.component.scss'
})
export class ProductsItemComponent implements OnInit {

  @Input()
  product!: Product

  quantity: number = 0

  availableAmountInCart$!: Observable<number | undefined>

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.quantity = this.product.minOrderAmount
    this.availableAmountInCart$ =
      this.store.select(selectAvailableAmountOfCartItem(this.product.id))
  }

  handleAddToCart(product: Product): void {
    const quantity: number = this.quantity || product.minOrderAmount
    if (quantity <= product.availableAmount) {
      this.store.dispatch(CartActions.addToCart({ product, quantity }))
    }
  }

}
