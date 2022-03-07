import { Product } from './Product';

export interface ProductState {

  id: number;
  quantity: number;
  unit: string;
  sn: string;
  product: Product;



  productName?: string;
}
