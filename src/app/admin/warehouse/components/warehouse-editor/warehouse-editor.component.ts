import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { Warehouse } from '../../../../_shared/models/Warehouse/Warehouse';

import { ToastService } from 'src/app/_shared/services/toast.service';
import { WarehouseService } from './../../services/warehouse.service';

@Component({
  selector: 'app-warehouse-editor',
  templateUrl: './warehouse-editor.component.html',
  styleUrls: ['./warehouse-editor.component.scss'],
})
export class WarehouseEditorComponent implements OnInit {

  @Input() warehouse: Warehouse | null;

  editorForm: FormGroup;
  editorFormActive = false;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private modalController: ModalController,
              private warehouseService: WarehouseService,
              private toastService: ToastService
              // private store: Store<State>
              ) {
  }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildEditorForm(this.warehouse);
  }

  onSubmit() {

    if (this.editorForm.invalid) {
      this.submitted = true;
      return;
    }

    const warehouse = this.editorForm.value as Warehouse;

    this.loading = true;

    if (this.warehouse === undefined) {
      this.warehouseService.store(warehouse).subscribe(
        result => {
          this.toastService.showSuccess('Magacin je uspešno dodat u sistem!');
          this.editorForm.reset();
          this.modalController.dismiss(result as Warehouse);
        },
        error => {
          // TODO handle error
          // this.toastService.showError(error);
        }
      );
    } else {
      this.warehouseService.update(warehouse).subscribe(
        result => {
          this.toastService.showSuccess('Magacin je uspešno ažuriran!');
          this.editorForm.reset();
          this.modalController.dismiss(result as Warehouse);
        },
        error => {
          // TODO handle error
          // this.toastService.showError(error);
        }
      );
    }
  }

  buildEditorForm(warehouse?: Warehouse) {
    this.editorForm = this.formBuilder.group({
      id: [warehouse ? warehouse.id : null],
      name: [warehouse ? warehouse.name : '', Validators.required],
      city: [warehouse ? warehouse.city : '', Validators.required]
    });

    this.editorFormActive = true;
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
