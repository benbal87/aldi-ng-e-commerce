import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CartItem, CartState } from '../../models/cart.model'

export const selectCartState =
  createFeatureSelector<CartState>('cart')

export const selectCartTotalQuantity =
  createSelector(
    selectCartState,
    (state: CartState): number =>
      state.cart.reduce(
        (sum: number, item: CartItem): number => sum + item.quantity,
        0
      )
  )

export const selectCartTotalPrice =
  createSelector(
    selectCartState,
    (cart: CartState): number =>
      cart.cart.reduce(
        (total: number, item: CartItem): number =>
          total + item.product.price * item.quantity,
        0
      )
  )

export const selectCartItems =
  createSelector(
    selectCartState,
    (cart: CartState): CartItem[] =>
      cart.cart.reduce((acc: CartItem[], item: CartItem): CartItem[] => {
        return [
          ...acc,
          ...(item.quantity > 0 ? [item] : [])
        ]
      }, [])
  )

export const selectAvailableAmountOfCartItem =
  (productId: string) =>
    createSelector(
      selectCartState,
      (state: CartState): number | undefined =>
        state.cart
          .find((item: CartItem): boolean => item.product.id === productId)
          ?.product
          .availableAmount
    )
