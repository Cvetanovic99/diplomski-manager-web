import { ProductState } from './../Product/ProductState';
import { Project } from './../Project/Project';
import { User } from '../Auth/User';
import { Product } from '../Product/Product';

export interface Task {

  id: number;
  quantityUsed: number;
  description: string;
  productState: ProductState;
  sn: string;
  project: Project;
  employed1: User;
  employed2: User;
  createdAt: string;
  product: Product;
}
