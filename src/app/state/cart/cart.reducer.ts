import { createReducer, on } from '@ngrx/store'
import { CartItem, CartState } from '../../models/cart.model'
import { CartActions } from './cart.actions'

const getIndexOfCartItem =
  (state: CartState, productId: string): number =>
    state.cart.findIndex((item: CartItem): boolean =>
      item.product.id === productId
    )

const initialState: CartState = {
  cart: []
}

const cartReducer = createReducer(
  initialState,
  on(CartActions.initializeCart, (state, { products }) => ({
    ...state,
    cart: products.map(product => ({ product, quantity: 0 }))
  })),
  on(
    CartActions.addToCart,
    (state: CartState, { product, quantity: quantityToAdd }) => {
      const updatedCart: CartItem[] = [...state.cart]

      const indexOfProductInCart: number = getIndexOfCartItem(state, product.id)

      const {
        product: productFound,
        quantity: quantityInCart
      } = updatedCart[indexOfProductInCart] ?? {}

      if (
        productFound &&
        productFound.availableAmount >= quantityToAdd &&
        quantityToAdd > 0
      ) {
        updatedCart[indexOfProductInCart] = {
          product: {
            ...productFound,
            availableAmount: productFound.availableAmount - quantityToAdd
          },
          quantity: quantityInCart + quantityToAdd
        }
      } else if (
        product &&
        product.availableAmount >= quantityToAdd &&
        product.minOrderAmount <= quantityToAdd
      ) {
        const newCartItem: CartItem = {
          product: {
            ...product,
            availableAmount: product.availableAmount - quantityToAdd
          },
          quantity: quantityToAdd
        }
        updatedCart.push(newCartItem)
      }
      return { ...state, cart: updatedCart }
    }
  ),
  on(
    CartActions.updateQuantity,
    (state: CartState, { productId, quantity: quantityNew }) => {
      const indexOfProductInCart: number = getIndexOfCartItem(state, productId)

      const updatedCart: CartItem[] = [...state.cart]
      const { product, quantity } = updatedCart[indexOfProductInCart] ?? {}

      if (product) {
        const { availableAmount } = product
        const availableAmountOriginal: number = availableAmount + quantity

        if (availableAmountOriginal >= quantityNew) {
          updatedCart[indexOfProductInCart] = {
            product: {
              ...product,
              availableAmount: availableAmountOriginal - quantityNew
            },
            quantity: quantityNew
          }
          return { ...state, cart: updatedCart }
        }
      }

      return state
    }
  ),
  on(
    CartActions.incrementQuantity,
    (state: CartState, { productId }) => {
      const indexOfProductInCart: number = getIndexOfCartItem(state, productId)

      if (indexOfProductInCart >= 0) {
        const quantityToAdd: number = 1
        const updatedCart: CartItem[] = [...state.cart]
        const { availableAmount } = updatedCart[indexOfProductInCart].product

        if (availableAmount >= quantityToAdd) {
          updatedCart[indexOfProductInCart] = {
            product: {
              ...updatedCart[indexOfProductInCart].product,
              availableAmount: availableAmount - quantityToAdd
            },
            quantity: updatedCart[indexOfProductInCart].quantity + quantityToAdd
          }
          return { ...state, cart: updatedCart }
        }
      }
      return state
    }
  ),
  on(
    CartActions.decrementQuantity,
    (state: CartState, { productId }) => {
      const updatedCart: CartItem[] = [...state.cart]

      const indexOfProductInCart: number = getIndexOfCartItem(state, productId)

      const { product, quantity } = updatedCart[indexOfProductInCart] ?? {}
      const { minOrderAmount, availableAmount } = product ?? {}

      const quantityToDeduct: number = 1
      const quantityNext: number = quantity - quantityToDeduct

      if (quantity > 1 && minOrderAmount <= quantityNext) {
        updatedCart[indexOfProductInCart] = {
          product: {
            ...product,
            availableAmount: availableAmount + quantityToDeduct
          },
          quantity: quantityNext
        }

        return { ...state, cart: updatedCart }
      }

      return state
    }
  ),
  on(CartActions.removeFromCart, (state, { productId }) => {
    const updatedCart: CartItem[] = state.cart
      .filter((item: CartItem): boolean => item.product.id !== productId)
    return { ...state, cart: updatedCart }
  })
)

export default cartReducer
