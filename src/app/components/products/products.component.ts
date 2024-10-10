import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
  LayoutModule
} from '@angular/cdk/layout'
import { CommonModule, NgOptimizedImage } from '@angular/common'
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatIcon } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator'
import { MatSort, MatSortModule, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MatTooltip } from '@angular/material/tooltip'
import { Store } from '@ngrx/store'
import { map, Observable, Subscription, tap } from 'rxjs'
import { Product } from '../../models/product.model'
import { CartActions } from '../../state/cart/cart.actions'
import { selectAllProducts } from '../../state/cart/cart.selectors'
import { ProductsItemComponent } from '../products-item/products-item.component'

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    NgOptimizedImage,
    MatIcon,
    MatTooltip,
    LayoutModule,
    MatPaginatorModule,
    MatSortModule,
    ProductsItemComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly GRID_COLS_DEFAULT: number = 4
  private productsSubscription!: Subscription
  products$!: Observable<Product[]>
  sortedProducts$!: Observable<Product[]>
  quantities: { [key: string]: number } = {}
  gridCols: number = this.GRID_COLS_DEFAULT
  pageIndex: number = 0
  pageSize: number = 5
  pageStartItemIndex: number = 0
  pageEndItemIndex: number = 5
  sortState: Sort = { active: '', direction: '' }
  dataSource: MatTableDataSource<Product>

  @ViewChild(MatSort)
  sort!: MatSort

  @ViewChild(MatPaginator)
  paginator!: MatPaginator

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {
    this.dataSource = new MatTableDataSource<Product>([])
  }

  ngOnInit(): void {
    // this.initBreakpointObserver()
    this.products$ = this.store.select(selectAllProducts)
      .pipe(
        tap((products: Product[]): void => {
          this.dataSource.data = products
        })
      )
    this.sortedProducts$ = this.products$.pipe(
      map(products => this.sortData(this.sortState, products))
    )
    this.initQuantities()
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe()
  }

  ngAfterViewInit(): void {
    this.initPagination()
  }

  initPagination(): void {
    if (!this.dataSource.paginator) {
      this.dataSource.paginator = this.paginator
      this.dataSource.paginator.pageIndex = this.pageIndex
      this.dataSource.paginator.pageSize = this.pageSize
      this.dataSource.paginator.pageSizeOptions = [5, 10, 25, 50, 100]
      this.dataSource.paginator.length = this.dataSource.data.length
      this.dataSource.sort = this.sort
    }
  }

  initQuantities(): void {
    this.productsSubscription =
      this.products$.subscribe((products: Product[]): void => {
        this.quantities = products.reduce(
          (acc: { [key: string]: number }, { id, minOrderAmount }: Product) =>
            ({
              ...acc,
              [id]: minOrderAmount
            }),
          {}
        )
      })
  }

  initBreakpointObserver() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web,
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait,
      Breakpoints.WebPortrait,
      Breakpoints.HandsetLandscape,
      Breakpoints.TabletLandscape,
      Breakpoints.WebLandscape
    ]).subscribe((result: BreakpointState): void => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.gridCols = 1
        } else if (result.breakpoints[Breakpoints.Small]) {
          this.gridCols = 2
        } else if (result.breakpoints[Breakpoints.Medium]) {
          this.gridCols = 3
        } else if (result.breakpoints[Breakpoints.Large]) {
          this.gridCols = 4
        } else if (result.breakpoints[Breakpoints.XLarge]) {
          this.gridCols = 5
        } else if (result.breakpoints[Breakpoints.Handset]) {
          this.gridCols = 1
        } else if (result.breakpoints[Breakpoints.Tablet]) {
          this.gridCols = 3
        } else if (result.breakpoints[Breakpoints.Web]) {
          this.gridCols = 4
        } else if (result.breakpoints[Breakpoints.HandsetPortrait]) {
          this.gridCols = 1
        } else if (result.breakpoints[Breakpoints.TabletPortrait]) {
          this.gridCols = 3
        } else if (result.breakpoints[Breakpoints.WebPortrait]) {
          this.gridCols = 4
        } else if (result.breakpoints[Breakpoints.HandsetLandscape]) {
          this.gridCols = 2
        } else if (result.breakpoints[Breakpoints.TabletLandscape]) {
          this.gridCols = 4
        } else if (result.breakpoints[Breakpoints.WebLandscape]) {
          this.gridCols = 4
        } else {
          // Default case if no specific breakpoint matches
          this.gridCols = this.GRID_COLS_DEFAULT
        }
      }
    })
  }

  addToCart(product: Product) {
    const quantity = this.quantities[product.id] || product.minOrderAmount
    if (quantity <= product.availableAmount) {
      this.store.dispatch(CartActions.addToCart({ product, quantity }))
    }
  }

  handlePageEvent(e: PageEvent): void {
    this.pageIndex = e.pageIndex
    this.pageSize = e.pageSize
    this.pageStartItemIndex = this.pageIndex * this.pageSize
    this.pageEndItemIndex = this.pageStartItemIndex + this.pageSize
  }

  sortData(sort: Sort, products: Product[]): Product[] {
    if (!sort.active || sort.direction === '') {
      return products
    }

    return products.sort((a, b) => {
      const isAsc = sort.direction === 'asc'
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc)
        case 'price':
          return this.compare(a.price, b.price, isAsc)
        default:
          return 0
      }
    })
  }

  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
  }
}
