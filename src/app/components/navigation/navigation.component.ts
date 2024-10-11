import { AsyncPipe } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterModule } from '@angular/router'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { BadgeDirective } from '../../directives/badge.directive'
import { selectCartTotalQuantity } from '../../state/cart/cart.selectors'

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    AsyncPipe,
    BadgeDirective
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {

  cartQuantity$!: Observable<number>

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.cartQuantity$ = this.store.select(selectCartTotalQuantity)
  }
}
