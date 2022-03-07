import { ProductService } from '../../services/product.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Product } from 'src/app/_shared/models/Product/Product';
import { ToastService } from 'src/app/_shared/services/toast.service';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss'],
})
export class ProductEditorComponent implements OnInit {

  @Input() product: Product | undefined;

  editorForm: FormGroup;
  editorFormActive = false;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private modalController: ModalController,
              private productService: ProductService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildEditorForm(this.product);
  }

  onSubmit() {

    if (this.editorForm.invalid) {
      this.submitted = true;
      return;
    }

    const product = this.editorForm.value as Product;
    if(product.hasSN)
    {
      product.unit = 'kom';
    }


    this.loading = true;
    if (this.product === undefined) {
      this.productService.store(product).subscribe(
        result => {
          this.toastService.showSuccess('Proizvod je uspešno dodat u sistem!');
          this.editorForm.reset();
          this.modalController.dismiss(result);
        },
        error => {
          // TODO handle error
          this.toastService.showError('Trenutno nije dodati proizvod!');
          // this.toastService.showError(error);

        },
        () => this.loading = false
      );
    } else {
      this.productService.update(product).subscribe(
        result => {
          this.toastService.showSuccess('Proizvod je uspešno ažuriran!');
          this.editorForm.reset();
          this.modalController.dismiss(result);
        },
        error => {
          this.toastService.showError('Trenutno nije moguće ažurirati proizvod!');
          // TODO handle error
          // this.toastService.showError(error);
        },
        () => this.loading = false
      );
    }


  }

  hasSnChengeHandler(): void
  {

    if(!this.editorForm.controls.hasSN.value)
    {
      this.editorForm.controls.unit.setValue('kom');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.editorForm.controls.unit.disable();
    }
    else
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.editorForm.controls.unit.enable();
    }
    this.editorForm.controls.unit.updateValueAndValidity();
  }

  buildEditorForm(product?: Product) {
    this.editorForm = this.formBuilder.group({
      id:           [product ? product.id           : null],
      hasSN:        [product ? product.hasSN        : false],
      name:         [product ? product.name         : '', Validators.required],
      model:        [product ? product.model        : '', Validators.required],
      manufacturer: [product ? product.manufacturer : '', Validators.required],
      supplier:     [product ? product.supplier     : '', Validators.required],
      unit:         [product ? product.unit         : 'm', Validators.required]
    });

    if(product?.hasSN)
    {
      this.editorForm.controls.unit.disable();
      this.editorForm.controls.unit.setValue('kom');
      this.editorForm.controls.unit.updateValueAndValidity();
    }

    this.editorFormActive = true;
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
