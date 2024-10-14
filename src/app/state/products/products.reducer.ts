import { createReducer, on } from '@ngrx/store'
import { ProductsState } from '../../models/product.model'
import { ProductsActions } from './products.actions'

const initialState: ProductsState = {
  products: [],
  isLoading: false,
  error: null
}

const productsReducer = createReducer(
  initialState,
  on(
    ProductsActions.loadProducts,
    (state: ProductsState) =>
      ({ ...state, isLoading: true, error: null })
  ),
  on(
    ProductsActions.loadProductsSuccess,
    (state: ProductsState, { products }) =>
      ({
        ...state,
        products,
        isLoading: false,
        error: null
      })
  ),
  on(
    ProductsActions.loadProductsFailure,
    (state: ProductsState, { error }) =>
      ({
        ...state,
        isLoading: false,
        error
      })
  )
)

export default productsReducer
