import { AsyncPipe, CurrencyPipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButton, MatIconButton } from '@angular/material/button'
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardTitle
} from '@angular/material/card'
import { MatDivider } from '@angular/material/divider'
import { MatFormField, MatSuffix } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput, MatLabel } from '@angular/material/input'
import { Store } from '@ngrx/store'
import { map, Observable } from 'rxjs'
import {
  selectCartTotalPrice,
  selectCartTotalQuantity
} from '../../state/cart/cart.selectors'

@Component({
  selector: 'app-cart-order-summary',
  standalone: true,
  imports: [
    AsyncPipe,
    CurrencyPipe,
    FormsModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardFooter,
    MatCardTitle,
    MatDivider,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix
  ],
  templateUrl: './cart-order-summary.component.html',
  styleUrl: './cart-order-summary.component.scss'
})
export class CartOrderSummaryComponent implements OnInit {
  totalPrice$!: Observable<number>
  totalQuantity$!: Observable<number>
  promoCode: string = ''
  readonly shippingCost: number = 50

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.totalQuantity$ = this.store.select(selectCartTotalQuantity)
    this.totalPrice$ = this.store.select(selectCartTotalPrice)
      .pipe(
        map((totalPrice: number): number => totalPrice + this.shippingCost)
      )
  }

  applyPromoCode(): void {
    //TODO: to be implemented
  }

  checkout(): void {
    //TODO: to be implemented
  }

}
