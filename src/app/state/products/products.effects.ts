import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, map, mergeMap } from 'rxjs/operators'
import { ProductsService } from '../../services/products.service'
import { ProductsActions } from './products.actions'

@Injectable()
export class ProductsEffects {
  loadProducts$

  constructor(
    private actions$: Actions,
    private productsService: ProductsService
  ) {
    this.loadProducts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ProductsActions.loadProducts),
        mergeMap(() =>
          this.productsService.getProducts().pipe(
            map((products) => ProductsActions.loadProductsSuccess({ products })),
            catchError((error) => of(ProductsActions.loadProductsFailure({ error })))
          )
        )
      )
    )
  }
}
