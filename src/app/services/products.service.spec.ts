import { provideHttpClient } from '@angular/common/http'
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing'
import { TestBed } from '@angular/core/testing'
import { Product } from '../models/product.model'
import { ProductsService } from './products.service'

describe('ProductsService', () => {
  let service: ProductsService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    service = TestBed.inject(ProductsService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should fetch products successfully', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Red apples',
        img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        availableAmount: 100,
        minOrderAmount: 10,
        price: 10.5
      },
      {
        id: '2',
        name: 'Bananas',
        img: 'https://dm.cms.aldi.cx/is/image/prod1amer/product/jpg/scaleWidth/306/10a4bf7d-f74f-4c37-ab27-2f7773c81039/Bananas%20%20%20per%20lb',
        availableAmount: 150,
        minOrderAmount: 5,
        price: 1
      }
    ]

    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(2)
      expect(products).toEqual(mockProducts)
    })

    const req = httpMock.expectOne(
      'https://63c10327716562671870f959.mockapi.io/products'
    )
    expect(req.request.method).toBe('GET')
    req.flush(mockProducts)
  })
  it('should handle an error when fetching products', () => {
    const errorMessage = 'Failed to load products'

    service.getProducts().subscribe(
      () => fail('Expected an error, not products'),
      (error) => {
        expect(error.status).toBe(500)
        expect(error.statusText).toBe('Internal Server Error')
      }
    )

    const req = httpMock.expectOne(
      'https://63c10327716562671870f959.mockapi.io/products'
    )
    expect(req.request.method).toBe('GET')
    req.flush(
      errorMessage,
      { status: 500, statusText: 'Internal Server Error' }
    )
  })
})
