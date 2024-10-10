import { NgOptimizedImage } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatIconButton } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { MatTooltip } from '@angular/material/tooltip'
import { Product } from '../../models/product.model'

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
    NgOptimizedImage
  ],
  templateUrl: './products-item.component.html',
  styleUrl: './products-item.component.scss'
})
export class ProductsItemComponent {

  @Input()
  product!: Product

  @Output()
  addToCart: EventEmitter<Product> = new EventEmitter<Product>()

  @Input()
  quantities: { [key: string]: number } = {}

  handleAddToCart(product: Product): void {
    this.addToCart.emit(product)
  }

}
