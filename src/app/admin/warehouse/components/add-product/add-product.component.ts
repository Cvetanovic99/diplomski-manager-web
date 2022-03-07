import { ProductPickerComponent } from './../product-picker/product-picker.component';
import { Warehouse } from './../../../../_shared/models/Warehouse/Warehouse';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarehouseService } from '../../services/warehouse.service';
import { ToastService } from '../../../../_shared/services/toast.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { Product } from '../../../../_shared/models/Product/Product';
import { AddProductToWarehouse } from '../../../../_shared/models/Warehouse/AddProductToWarehouse';
import { Types } from '../../../../_shared/constants/Constants';
import { PickerComponent } from '../../../project/components/picker/picker.component';
import { UpdateProductInWarehouse } from '../../../../_shared/models/Warehouse/UpdateProductInWarehouse';
import {ProductStateDto} from '../../../../_shared/models/Product/ProductStateDto';
import {ProductService} from '../../../product/services/product.service';
import { AddProductWithSNCodesToWarehouse } from 'src/app/_shared/models/Warehouse/AddProductWithSNCodesToWarehouse';
import { UpdateProductWithSNCodesInWarehouse } from 'src/app/_shared/models/Warehouse/UpdateProductWithSNCodesInWarehouse';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {

  @Input() product: Product;
  @Input() warehouseId: number;
  @Input() isNew: boolean;
  create: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  snCodes: String = '';

  editorForm: FormGroup;
  editorFormActive = false;
  submitted = false;
  types = Types;
  productPicker: any;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private warehouseService: WarehouseService,
              private modalController: ModalController,
              private popoverController: PopoverController,
              private productService: ProductService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.create = !this.product;

    if(this.isNew)
    {
      this.buildEditorForm(this.product);
    }
    else
    {
      this.getSNCodesFromArray(this.product.states);
    }
  }



  getSNCodesFromArray(productStateObjects): void
  {

    let snCodes = '';
    for(let i=0; i<productStateObjects.length; i++)
    {
      if(i<productStateObjects.length-1)
      {
        snCodes += productStateObjects[i].sn+',';
      }
      else{
        snCodes += productStateObjects[i].sn;
      }
    }
    this.snCodes = snCodes;
    this.buildEditorForm(this.product);
  }

  removeNewLines(): void{
    // eslint-disable-next-line prefer-const
    let snCodes: string = this.editorForm.controls.snCodes.value;
    snCodes.replace('\n','');
    this.editorForm.controls.snCodes.setValue(snCodes);
    this.editorForm.controls.snCodes.updateValueAndValidity();
  }

  onSubmit() {

    if(this.product && this.product.hasSN)
    {
      this.removeNewLines();
    }


    if (this.editorForm.invalid) {
      this.submitted = true;
      return;
    }

    if(this.product.hasSN)
    {
      this.productWithSNCodesEditor();
    }
    else
    {
      this.productWithoutSNCodesEditor();
    }


  }

  productWithSNCodesEditor(): void{

    if (this.create) {

      const body ={
        warehouseId: this.editorForm.controls.warehouseId.value,
        productId: this.editorForm.controls.productId.value,
        quantity: 1,
        snCodes: this.editorForm.controls.snCodes.value
      };

      //this.editorForm.value as AddProductWithSNCodesToWarehouse;
      this.warehouseService.addProductWithSNCodes(body).subscribe(
        result => {
          this.toastService.showSuccess('Proizvod je uspešno dodat u magacin!');
          this.editorForm.reset();
          this.modalController.dismiss(result as Product);
        },
        error => {
          this.toastService.showError(error.error.message);
        }
      );
    } else {

      const body = {
        productId: this.editorForm.controls.productId.value,
        warehouseId:  this.editorForm.controls.warehouseId.value,
        quantity: 1,
        snCodes: this.editorForm.controls.snCodes.value
      } as unknown as UpdateProductWithSNCodesInWarehouse;

      this.warehouseService.editProductWithSNCodesState(body).subscribe(
        result => {
          this.toastService.showSuccess('Proizvod je uspešno izmenjen u magacinu!');
          this.editorForm.reset();
           this.modalController.dismiss(result as Product);
        },
        error => {
          this.toastService.showError(error.error.message);
        }
      );
    }
  }

  productWithoutSNCodesEditor(): void{
    if (this.create) {

      const body = {
        warehouseId: this.editorForm.controls.warehouseId.value,
        productId:   this.editorForm.controls.productId.value,
        quantity:    this.editorForm.controls.quantity.value
      } as AddProductToWarehouse;


      this.warehouseService.addProduct(body).subscribe(
        result => {
          this.toastService.showSuccess('Proizvod je uspešno dodat u magacin!');
          this.editorForm.reset();
          this.modalController.dismiss(result as Product);
        },
        error => {
          this.toastService.showError(error.error.message);
          // this.toastService.showError(error);
        }
      );
    } else {

      const body = {
        warehouseId: this.editorForm.controls.warehouseId.value,
        productId:   this.editorForm.controls.productId.value,
        quantity:    this.editorForm.controls.quantity.value
      } as UpdateProductInWarehouse;
      this.warehouseService.editProductState(body).subscribe(
        result => {
          this.toastService.showSuccess('Proizvod je uspešno izmenjen u magacinu!');
          this.editorForm.reset();
           this.modalController.dismiss(result as Product);
        },
        error => {
          this.toastService.showError(error.error.message);
        }
      );
    }
  }

  buildEditorForm(product?: Product) {
    const quantityValidators = [Validators.required, Validators.min(1)];

    this.editorForm = this.formBuilder.group({
      warehouseId: [this.warehouseId,            Validators.required],
      productId:   [product ? product.id : null, Validators.required],
      quantity:    [product?.states && !this.product?.hasSN ? product.states[0].quantity : 1, quantityValidators],
      snCodes:     [this.product?.hasSN ? this.snCodes : [], []]
    });

    this.editorFormActive = true;
    this.loading = false;
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  async openPicker(type: Types) {
    const isNew = !this.product;

    this.productPicker = await this.popoverController.create({
      component: ProductPickerComponent,
      componentProps: {
        type,
        isNew,
        warehouseId: this.warehouseId
      }
    });

    this.productPicker.onDidDismiss().then(
      result => {

        if(result.data?.dismissed)
        {
          return;
        }
        if (!result?.data) {
          return;
        }

        this.product = result.data;
        this.editorForm.controls.productId.setValue(this.product.id);
        this.editorForm.controls.productId.updateValueAndValidity();

        if (this.product.hasSN) {
          this.editorForm.controls.snCodes.setValidators([Validators.required]);
        }
        else {
          this.editorForm.controls.snCodes.setValidators([]);
        }
        this.editorForm.controls.snCodes.updateValueAndValidity();

      }
    );

    await this.productPicker.present();

  }
}
