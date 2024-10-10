import { Routes } from '@angular/router'
import { CartComponent } from '../components/cart/cart.component'
import { ProductsComponent } from '../components/products/products.component'
import { WelcomeComponent } from '../components/welcome/welcome.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { animation: 'ProductsPage' }
  },
  {
    path: 'cart',
    component: CartComponent,
    data: { animation: 'CartsPage' }
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    data: { animation: 'WelcomePage' }
  },
  {
    path: '**',
    redirectTo: '/welcome',
    pathMatch: 'full'
  }
]
