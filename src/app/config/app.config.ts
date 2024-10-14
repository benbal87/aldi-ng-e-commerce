import { provideHttpClient } from '@angular/common/http'
import {
  ApplicationConfig,
  EnvironmentProviders,
  importProvidersFrom,
  provideZoneChangeDetection
} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  provideAnimationsAsync
} from '@angular/platform-browser/animations/async'
import {
  PreloadAllModules,
  provideRouter,
  withPreloading
} from '@angular/router'
import { provideEffects } from '@ngrx/effects'
import { provideState, provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'

import { routes } from '../routing/app.routes'
import cartReducer from '../state/cart/cart.reducer'
import { ProductsEffects } from '../state/products/products.effects'
import productsReducer from '../state/products/products.reducer'

const stateProviders: EnvironmentProviders[] = [
  provideState({ name: 'cart', reducer: cartReducer }),
  provideState({ name: 'products', reducer: productsReducer })
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideAnimationsAsync(),
    provideStore(),
    ...stateProviders,
    provideStoreDevtools({
      maxAge: 25 // Retain last 25 states
      // logOnly: environment.production, // Restrict to log-only in production
    }),
    importProvidersFrom([BrowserAnimationsModule, BrowserModule]),
    provideEffects([ProductsEffects])
  ]
}
