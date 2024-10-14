export interface Product {
  id: string
  name: string
  img: string
  availableAmount: number
  minOrderAmount: number
  price: number
}

export interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}
