import { Product } from './product.model'

export interface CartItem {
  product: Product,
  quantity: number
}

export interface CartState {
  cart: CartItem[]
}
