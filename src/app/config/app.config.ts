import { provideHttpClient } from '@angular/common/http'
import {
  ApplicationConfig,
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
import { provideState, provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'

import { routes } from '../routing/app.routes'
import cartReducer from '../state/cart/cart.reducer'

const stateProviders = [
  provideState({ name: 'cart', reducer: cartReducer })
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
    importProvidersFrom([BrowserAnimationsModule, BrowserModule])
  ]
}
