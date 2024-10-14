import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Product } from '../../models/product.model'

export const ProductsActions = createActionGroup({
  source: 'Product',
  events: {
    'Load Products': emptyProps(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>()
  }
})
