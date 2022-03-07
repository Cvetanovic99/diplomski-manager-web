import { UserService } from '../../../user/services/user.service';
import { ClientService } from '../../../client/services/client.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Client } from 'src/app/_shared/models/Client';
import { User } from 'src/app/_shared/models/Auth/User';
import { PopoverController } from '@ionic/angular';
import { Types } from '../../../../_shared/constants/Constants';
import { WarehouseService } from '../../../warehouse/services/warehouse.service';
import { Warehouse } from '../../../../_shared/models/Warehouse/Warehouse';
import { Product } from '../../../../_shared/models/Product/Product';
import { ProductService } from '../../../product/services/product.service';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
})
export class PickerComponent implements OnInit {

  @Input() type: Types;
  @Input() isNew:    boolean | null;

  clients:    Client[];
  users:      User[];
  warehouses: Warehouse[];
  products:   Product[];

  filter: FormControl;
  pickerFormActive = false;
  submitted = false;
  loading = false;
  pickerPaginationConfig = {
    pageIndex: 0,
    pageSize: 5,
    total: undefined
  };
  types = Types;

  constructor(private clientService: ClientService,
              private userService:   UserService,
              private warehouseService: WarehouseService,
              private productService: ProductService,
              private popoverController: PopoverController) { }

  get takeEntity() {
    switch (this.type) {
      case Types.client:
        return 'Klijenta';
      case Types.user:
        return 'Zaposljenog';
      case Types.warehouse:
        return 'Magacin';
      case Types.product:
        return 'Proizvod';
    }
  }

  getItems() {
    switch (this.type) {
      case Types.client:
        return this.clients;
      case Types.user:
        return this.users;
      case Types.warehouse:
        return this.warehouses;
      case Types.product:
        return this.products;
    }
  }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildFilter();
    switch (this.type) {
      case Types.client:
        this.fetchClients();
        break;
      case Types.user:
        this.fetchUsers();
        break;
      case Types.warehouse:
        this.fetchWarehouses();
        break;
      case Types.product:
        this.fetchProducts();
        break;
    }
  }

  buildFilter(): void {

    this.filter = new FormControl('');

    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.pickerPaginationConfig.pageIndex = 0;
        this.getData();
      });

    this.getData();
  }

  changePage(next: boolean): void {
    this.pickerPaginationConfig.pageIndex = (next ? this.pickerPaginationConfig.pageIndex + 1 : this.pickerPaginationConfig.pageIndex - 1);
    this.getData();
  }

  getData(): void
  {

    switch (this.type) {

      case Types.client:
        this.fetchClients();
        break;
      case Types.user:
        this.fetchUsers();
        break;
      case Types.warehouse:
        this.fetchWarehouses();
        break;
      case Types.product:
        this.fetchProducts();
        break;
    }
  }

  pick(result: any) {

    let data;

    switch (this.type) {
      case Types.client:
        data = result as Client;
        break;
      case Types.user:
        data = result as User;
        break;
      case Types.warehouse:
        data = result as Warehouse;
        break;
      case Types.product:
        data = result as Product;
        break;
    }

     this.popoverController.dismiss(data);
  }


  private fetchClients() {
    this.loading = true;
    this.clientService.index(this.filter.value, this.pickerPaginationConfig.pageIndex,this.pickerPaginationConfig.pageSize)
      .subscribe(
        result => {
          this.clients = result.items;
          this.pickerPaginationConfig.total = result.total;
        },
        error =>{
          //TODO: add error handler
        },
        () => this.loading = false
      );
  }

  private fetchUsers() {
    this.loading = true;
    this.userService.index(this.filter.value, this.pickerPaginationConfig.pageIndex,this.pickerPaginationConfig.pageSize)
      .subscribe(
        result => {
          this.users = result.items;
          this.pickerPaginationConfig.total = result.total;
        },
        error =>{
          //TODO: add error handler
        },
        () => this.loading = false
      );
  }

  private fetchWarehouses() {
    this.loading = true;
    this.warehouseService.index(this.filter.value, this.pickerPaginationConfig.pageIndex,this.pickerPaginationConfig.pageSize)
      .subscribe(
        result => {
          this.warehouses = result.items;
          this.pickerPaginationConfig.total = result.total;
        },
        error =>{
          //TODO: add error handler
        },
        () => this.loading = false
      );
  }

  private fetchProducts() {
    this.loading = true;
    this.productService.index(this.filter.value, this.pickerPaginationConfig.pageIndex,this.pickerPaginationConfig.pageSize)
      .subscribe(
        result => {
          this.products = result.items;
          this.pickerPaginationConfig.total = result.total;
        },
        error =>{
          //TODO: add error handler
        },
        () => this.loading = false
      );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dismiss(): void {
    this.popoverController.dismiss({
      dismissed: true
    });
  }
}
