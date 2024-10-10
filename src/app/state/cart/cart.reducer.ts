import { createReducer, on } from '@ngrx/store'
import { CartItem, CartState } from '../../models/cart.model'
import { CartActions } from './cart.actions'

const initialState: CartState = {
  cart: []
}

const cartReducer = createReducer(
  initialState,
  on(CartActions.initializeCart, (state, { products }) => ({
    ...state,
    cart: products.map(product => ({ product, quantity: 0 }))
  })),
  on(CartActions.addToCart, (state, { product, quantity }) => {
    const i: number =
      state.cart.findIndex(item => item.product.id === product.id)
    const updatedCart: CartItem[] = [...state.cart]
    if (i >= 0) {
      const { availableAmount } = updatedCart[i].product
      if (availableAmount >= quantity) {
        updatedCart[i] = {
          product: {
            ...product,
            availableAmount: availableAmount - quantity
          },
          quantity: updatedCart[i].quantity + quantity
        }
        return { ...state, cart: updatedCart }
      }
    }
    return state
  }),
  on(CartActions.incrementQuantity, (state, { productId }) => {
    const i: number =
      state.cart.findIndex(item => item.product.id === productId)
    if (i >= 0) {
      const add: number = 1
      const cart: CartItem[] = [...state.cart]
      const { availableAmount } = cart[i].product

      if (availableAmount >= add) {
        cart[i] = {
          product: {
            ...cart[i].product,
            availableAmount: availableAmount - add
          },
          quantity: cart[i].quantity + add
        }
        return { ...state, cart }
      }
    }
    return state
  }),
  on(CartActions.decrementQuantity, (state, { productId }) => {
    const i: number =
      state.cart.findIndex(item => item.product.id === productId)

    if (i >= 0 && state.cart[i].quantity > 1) {
      const deduct: number = 1
      const updatedCart: CartItem[] = [...state.cart]
      const {
        product: { minOrderAmount, availableAmount },
        quantity: quantityOriginal
      } = updatedCart[i]
      const quantityNext: number = quantityOriginal - deduct

      if (minOrderAmount <= quantityNext) {
        updatedCart[i] = {
          product: {
            ...updatedCart[i].product,
            availableAmount: availableAmount + deduct
          },
          quantity: quantityNext
        }
        return { ...state, cart: updatedCart }
      }
    }
    return state
  }),
  on(CartActions.removeFromCart, (state, { productId }) => {
    const i: number =
      state.cart.findIndex(item => item.product.id === productId)
    if (i >= 0) {
      const updatedCart: CartItem[] = [...state.cart]
      const { product, quantity } = updatedCart[i]
      updatedCart[i] = {
        product: {
          ...product,
          availableAmount: product.availableAmount + quantity
        },
        quantity: 0
      }
      return { ...state, cart: updatedCart }
    }
    return state
  })
)

export default cartReducer
