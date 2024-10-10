import { createActionGroup, props } from '@ngrx/store'
import { Product } from '../../models/product.model'

export const CartActions = createActionGroup({
  source: 'Cart',
  events: {
    'Initialize Cart': props<{ products: Product[] }>(),
    'Add To Cart': props<{ product: Product, quantity: number }>(),
    'Increment Quantity': props<{ productId: string }>(),
    'Decrement Quantity': props<{ productId: string }>(),
    'Remove From Cart': props<{ productId: string }>()
  }
})
