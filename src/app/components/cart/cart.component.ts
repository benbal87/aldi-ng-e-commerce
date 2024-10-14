import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { CartItem } from '../../models/cart.model'
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
    RouterLink,
    MatIconModule,
    MatButtonModule,
    CartItemComponent,
    CartOrderSummaryComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cartItems$!: Observable<CartItem[]>

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.cartItems$ = this.store.select(selectCartItems)
  }
}
