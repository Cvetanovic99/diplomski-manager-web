import { Warehouse } from './../Warehouse/Warehouse';
import { Product } from 'src/app/_shared/models/Product/Product';
export interface ProductStateDto {

  id: number;
  product: Product;
  quantity: number;
  sn:     string;
  unit: string;
  name: string;
  warehouse: Warehouse;
}
