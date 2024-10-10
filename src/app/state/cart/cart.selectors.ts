import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CartItem, CartState } from '../../models/cart.model'
import { Product } from '../../models/product.model'

export const selectCartState =
  createFeatureSelector<CartState>('cart')

export const selectCart =
  createSelector(selectCartState, state => state.cart)

export const selectCartTotalQuantity =
  createSelector(
    selectCart,
    (cart: CartItem[]): number =>
      cart.reduce(
        (sum: number, item: CartItem): number => sum + item.quantity,
        0
      )
  )

export const selectCartTotalPrice =
  createSelector(
    selectCart,
    (cart: CartItem[]): number =>
      cart.reduce(
        (total: number, item: CartItem): number =>
          total + item.product.price * item.quantity,
        0
      )
  )

export const selectCartItems =
  createSelector(
    selectCart,
    (cart: CartItem[]): CartItem[] =>
      cart.reduce((acc: CartItem[], item: CartItem): CartItem[] => {
        return [
          ...acc,
          ...(item.quantity > 0 ? [item] : [])
        ]
      }, [])
  )

export const selectAllProducts =
  createSelector(
    selectCart,
    (cart: CartItem[]): Product[] => cart.map(item => item.product)
  )
