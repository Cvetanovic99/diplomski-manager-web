import {ProductState} from './ProductState';

export interface Product {

  id:           number;
  hasSN:        boolean;
  model:        string;
  name:         string;
  manufacturer: string;
  supplier:     string;
  unit:         string;

  states:  ProductState[];
}
