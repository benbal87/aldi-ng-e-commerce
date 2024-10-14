import { AsyncPipe, NgOptimizedImage } from '@angular/common'
import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconButton } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormField } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput, MatLabel } from '@angular/material/input'
import { MatTooltip } from '@angular/material/tooltip'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { CartItem } from '../../models/cart.model'
import { Product } from '../../models/product.model'
import { CartActions } from '../../state/cart/cart.actions'
import { selectCartItem } from '../../state/cart/cart.selectors'

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
export class ProductsItemComponent implements OnInit, OnDestroy {

  @Input()
  product!: Product

  cartItemOfProduct$!: Observable<CartItem | undefined>

  quantity: number = 0

  isAddToCartButtonDisabled: boolean = false

  min: number = 0

  max: number = 0

  availableAmount: number = 0

  availableAmountInCart: number | undefined = 0

  quantityInCart: number | undefined = 0

  cartItemOfProductSubscription!: Subscription

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.quantity = this.product.minOrderAmount

    this.cartItemOfProduct$ =
      this.store.select(selectCartItem(this.product.id))

    this.cartItemOfProductSubscription =
      this.cartItemOfProduct$.subscribe(
        (cartItem: CartItem | undefined): void => {
          this.min =
            cartItem?.quantity ? 1 : this.product.minOrderAmount
          this.max =
            cartItem?.product.availableAmount ?? this.product.availableAmount
          this.availableAmount = this.product.availableAmount
          this.availableAmountInCart = cartItem?.product.availableAmount
          this.quantityInCart = cartItem?.quantity

          this.isAddToCartButtonDisabled =
            !this.isQuantityCanBeAddedToCart(
              this.product,
              this.availableAmountInCart,
              this.quantityInCart,
              this.quantity
            )
        })
  }

  ngOnDestroy(): void {
    this.cartItemOfProductSubscription?.unsubscribe()
  }

  getAvailableAmount(): number {
    return this.availableAmountInCart ?? this.availableAmount
  }

  onQuantityChange($event: number): void {
    this.isAddToCartButtonDisabled =
      !this.isQuantityCanBeAddedToCart(
        this.product,
        this.availableAmountInCart,
        this.quantityInCart,
        $event
      )
  }

  handleAddToCart(): void {
    if (
      this.isQuantityCanBeAddedToCart(
        this.product,
        this.availableAmountInCart,
        this.quantityInCart,
        this.quantity
      )
    ) {
      this.store.dispatch(
        CartActions.addToCart({
          product: this.product,
          quantity: this.quantity || this.product.minOrderAmount
        })
      )
    }
  }

  private isQuantityCanBeAddedToCart(
    product: Product,
    availableAmountInCart: number | undefined,
    quantityInCart: number | undefined,
    quantityToAdd: number
  ): boolean {
    const { availableAmount, minOrderAmount } = product

    const isProductAlreadyAddedToCart =
      (input: number | undefined): input is number => !!input && input > 0

    return isProductAlreadyAddedToCart(quantityInCart)
      ? quantityToAdd > 0 && quantityToAdd <= (availableAmountInCart ?? 0)
      : quantityToAdd >= minOrderAmount && quantityToAdd <= availableAmount
  }
}
