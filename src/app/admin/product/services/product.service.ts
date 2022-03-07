import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../../_shared/models/PaginationResponse';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from '../../../_shared/services/base-api.service';
import { Product } from '../../../_shared/models/Product/Product';
import { WarehouseProduct } from '../../../_shared/models/Warehouse/WarehouseProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseApiService {

  public index(filter: string, pageIndex: number, pageSize: number, orderBy: string = 'ID', direction: string = 'DESC'): Observable<PaginationResponse<Product>> {

    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<PaginationResponse<Product>>(this.apiUrl + '/api/products', { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public show(productId: number): Observable<Product> {
    return this.http.get<Product>(this.apiUrl + `/api/products/${productId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public store(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl + '/api/products', product)
      .pipe(catchError(response => this.handleError(response)));
  }

  public update(product: Product): Observable<Product> {
    return this.http.put<Product>(this.apiUrl + `/api/products/${product.id}`, product)
      .pipe(catchError(response => this.handleError(response)));
  }

  public destroy(productId: number): Observable<any> {

    return this.http.delete(this.apiUrl + `/api/products/${productId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public warehouses(productId: number, filter: string,
                    pageIndex: number, pageSize: number,
                    orderBy: string = 'ID', direction: string = 'DESC'): Observable<PaginationResponse<WarehouseProduct>> {

    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<PaginationResponse<WarehouseProduct>>(this.apiUrl + `/api/products/${productId}/warehouses`, { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public hasSn(product: Product) {
    return product.hasSN != null;
  }
}
