import { Component, OnInit } from '@angular/core'
import { RouterModule, RouterOutlet } from '@angular/router'
import { Store } from '@ngrx/store'
import { routeAnimations } from './animations/route.animations'
import {
  NavigationComponent
} from './components/navigation/navigation.component'
import { Product } from './models/product.model'
import { ProductsService } from './services/products.service'
import { CartActions } from './state/cart/cart.actions'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, NavigationComponent],
  template: `
    <app-navigation></app-navigation>
    <div [@routeAnimations]="prepareRoute(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
  `,
  styles: ``,
  animations: [routeAnimations]
})
export class AppComponent implements OnInit {

  constructor(private store: Store, private productsService: ProductsService) {
  }

  ngOnInit(): void {
    this.productsService.getProducts()
      .subscribe((products: Product[]) => {
        this.store.dispatch(CartActions.initializeCart({ products }))
      })
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation']
  }

}
