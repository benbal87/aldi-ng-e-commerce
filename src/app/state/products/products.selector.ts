import { createFeatureSelector, createSelector } from '@ngrx/store'
import { Product, ProductsState } from '../../models/product.model'

export const selectProductsState =
  createFeatureSelector<ProductsState>('products')

export const selectAllProducts =
  createSelector(
    selectProductsState,
    (state: ProductsState): Product[] => state.products
  )

export const selectProductsIsLoading =
  createSelector(
    selectProductsState,
    (state: ProductsState): boolean => state.isLoading
  )

export const selectProductsError =
  createSelector(
    selectProductsState,
    (state: ProductsState): string | null => state.error
  )
