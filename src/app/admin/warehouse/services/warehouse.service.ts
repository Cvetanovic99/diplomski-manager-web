import { ProductStateDto } from './../../../_shared/models/Product/ProductStateDto';
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../_shared/services/base-api.service';
import { Observable } from 'rxjs';
import { PaginationResponse } from '../../../_shared/models/PaginationResponse';
import { Warehouse } from '../../../_shared/models/Warehouse/Warehouse';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { WarehouseProduct } from '../../../_shared/models/Warehouse/WarehouseProduct';
import {Product} from "../../../_shared/models/Product/Product";
import {AddProductToWarehouse} from "../../../_shared/models/Warehouse/AddProductToWarehouse";
import {UpdateProductInWarehouse} from "../../../_shared/models/Warehouse/UpdateProductInWarehouse";
import { AddProductWithSNCodesToWarehouse } from 'src/app/_shared/models/Warehouse/AddProductWithSNCodesToWarehouse';
import { UpdateProductWithSNCodesInWarehouse } from 'src/app/_shared/models/Warehouse/UpdateProductWithSNCodesInWarehouse';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService extends BaseApiService {


  public index(filter: string, pageIndex: number, pageSize: number, orderBy: string = 'ID', direction: string = 'DESC'): Observable<PaginationResponse<Warehouse>> {

    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<PaginationResponse<Warehouse>>(this.apiUrl + '/api/warehouses', { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public show(warehouseId: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(this.apiUrl + `/api/warehouses/${warehouseId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public store(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(this.apiUrl + '/api/warehouses', warehouse)
      .pipe(catchError(response => this.handleError(response)));
  }

  public update(warehouse: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(this.apiUrl + `/api/warehouses/${warehouse.id}`, warehouse)
      .pipe(catchError(response => this.handleError(response)));
  }

  public destroy(warehouseId: number): Observable<any> {

    return this.http.delete(this.apiUrl + `/api/warehouses/${warehouseId}`)
      .pipe(catchError(response => this.handleError(response)));
  }

  public products(warehouseId: number, filter: string,
                    pageIndex: number, pageSize: number,
                    orderBy: string = 'ID', direction: string = 'DESC'): Observable<PaginationResponse<Product>> {

    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<PaginationResponse<Product>>(this.apiUrl + `/api/warehouses/${warehouseId}/products`, { params })
      .pipe(catchError(response => this.handleError(response)));
  }


  public productsForTask(warehouseId: number, filter: string,
                  pageIndex: number, pageSize: number,
                  orderBy: string = 'ID', direction: string = 'DESC'): Observable<PaginationResponse<Product>> {

    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<PaginationResponse<Product>>(this.apiUrl + `/api/warehouses/${warehouseId}/products-for-tasks`, { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public productForTask(warehouseId: number, productId: number): Observable<any> {

    return this.http.get<any>(
      this.apiUrl + `/api/warehouses/${warehouseId}/products/${productId}`)
    .pipe(catchError(response => this.handleError(response)));
}

  public nonExistentproducts(warehouseId: number, filter: string,
    pageIndex: number, pageSize: number,
    orderBy: string = 'ID', direction: string = 'DESC'): Observable<PaginationResponse<Product>> {

    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<PaginationResponse<Product>>(this.apiUrl + `/api/warehouses/${warehouseId}/non-existent-products`, { params })
    .pipe(catchError(response => this.handleError(response)));
    }

  public addProduct(addProductToWarehouse: AddProductToWarehouse): Observable<any> {
    return this.http.post<any>(this.apiUrl + `/api/warehouses/${addProductToWarehouse.warehouseId}/products/${addProductToWarehouse.productId}`, addProductToWarehouse)
      .pipe(catchError(response => this.handleError(response)));
  }

  public editProductState(updateProductInWarehouse: UpdateProductInWarehouse): Observable<any> {
    // eslint-disable-next-line max-len
    return this.http.put<any>(this.apiUrl + `/api/warehouses/update-product-state/${updateProductInWarehouse.productId}/${updateProductInWarehouse.warehouseId}`, updateProductInWarehouse)
      .pipe(catchError(response => this.handleError(response)));
  }

  public getSNCodes(productId: number, warehouseId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `/api/warehouses/${warehouseId}/products/${productId}/sn-codes`)
    .pipe(catchError(response => this.handleError(response)));
  }

  // eslint-disable-next-line max-len
  public snCodesIndex(productId: number, warehouseId: number, filter: string, pageIndex: number,
                      pageSize: number, orderBy: string = 'ID', direction: string = 'DESC'):
                      Observable<PaginationResponse<ProductStateDto>> {

    const params = this.getQueryParams(filter, pageIndex, pageSize, orderBy, direction);

    return this.http.get<PaginationResponse<ProductStateDto>>
      (this.apiUrl +  `/api/warehouses/${warehouseId}/products/${productId}/sn-codes-pagination`, { params })
      .pipe(catchError(response => this.handleError(response)));
  }

  public addProductWithSNCodes(addProductWithSNCodesToWarehouse: AddProductWithSNCodesToWarehouse): Observable<any> {
    // eslint-disable-next-line max-len
    return this.http.post<any>(this.apiUrl + `/api/warehouses/${addProductWithSNCodesToWarehouse.warehouseId}/products/${addProductWithSNCodesToWarehouse.productId}`, addProductWithSNCodesToWarehouse)
      .pipe(catchError(response => this.handleError(response)));
  }

  public editProductWithSNCodesState(updateProductWithSNCodesInWarehouse: UpdateProductWithSNCodesInWarehouse): Observable<any> {
    // eslint-disable-next-line max-len
    return this.http.put<any>(this.apiUrl + `/api/warehouses/update-product-state/${updateProductWithSNCodesInWarehouse.productId}/${updateProductWithSNCodesInWarehouse.warehouseId}`, updateProductWithSNCodesInWarehouse)
      .pipe(catchError(response => this.handleError(response)));
  }


}
