import { ProductState } from '../Product/ProductState';

export interface WarehouseProduct {

  id: number;
  name: string;
  city: string;
  states: ProductState[];
}
