import { Routes } from '@angular/router'
import { WelcomeComponent } from '../components/welcome/welcome.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () =>
      import('../components/products/products.component')
        .then(m => m.ProductsComponent),
    data: {
      animation: 'ProductsPage'
    }
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('../components/cart/cart.component')
        .then(m => m.CartComponent),
    data: {
      animation: 'CartsPage'
    }
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    data: {
      animation: 'WelcomePage'
    }
  },
  {
    path: '**',
    redirectTo: '/welcome',
    pathMatch: 'full'
  }
]
