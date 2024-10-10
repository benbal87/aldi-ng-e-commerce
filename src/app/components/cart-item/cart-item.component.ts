import { CurrencyPipe, NgOptimizedImage, TitleCasePipe } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatButton, MatIconButton } from '@angular/material/button'
import {
  MatCard,
  MatCardContent,
  MatCardImage,
  MatCardTitle
} from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatTooltip } from '@angular/material/tooltip'
import { CartItem } from '../../models/cart.model'

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
    TitleCasePipe
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() item!: CartItem
  @Output() inc: EventEmitter<CartItem> = new EventEmitter<CartItem>()
  @Output() dec: EventEmitter<CartItem> = new EventEmitter<CartItem>()
  @Output() remove: EventEmitter<string> = new EventEmitter<string>()

  handleIncrement(item: CartItem): void {
    this.inc.emit(item)
  }

  handleDecrement(item: CartItem): void {
    this.dec.emit(item)
  }

  handleRemove(productId: string): void {
    this.remove.emit(productId)
  }
}
