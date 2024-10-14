import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { MatSort, MatSortModule, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { Store } from '@ngrx/store'
import { Observable, tap } from 'rxjs'
import { Product } from '../../models/product.model'
import { ProductsActions } from '../../state/products/products.actions'
import {
  selectAllProducts,
  selectProductsError,
  selectProductsIsLoading
} from '../../state/products/products.selector'
import { ProductsItemComponent } from '../products-item/products-item.component'

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIcon,
    MatPaginatorModule,
    MatSortModule,
    ProductsItemComponent,
    MatProgressSpinner
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products$!: Observable<Product[]>
  isLoading$!: Observable<boolean>
  error$!: Observable<string | null>
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

  constructor(private store: Store) {
    this.dataSource = new MatTableDataSource<Product>([])
  }

  ngOnInit(): void {
    this.store.dispatch(ProductsActions.loadProducts())

    this.products$ = this.store.select(selectAllProducts)
      .pipe(
        tap((products: Product[]): void => {
          this.dataSource.data = products
        })
      )
    this.isLoading$ = this.store.select(selectProductsIsLoading)
    this.error$ = this.store.select(selectProductsError)
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

  handlePageEvent(e: PageEvent): void {
    this.pageIndex = e.pageIndex
    this.pageSize = e.pageSize
    this.pageStartItemIndex = this.pageIndex * this.pageSize
    this.pageEndItemIndex = this.pageStartItemIndex + this.pageSize
  }

  sortData(sort: Sort, products: Product[]) {
    if (!sort.active || sort.direction === '') {
      return
    }

    const productsCopy = [...products]
    const sorted = productsCopy.sort((a, b) => {
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

    this.store.dispatch(ProductsActions.loadProductsSuccess({
      products: sorted
    }))
  }

  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
  }
}
