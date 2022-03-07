import { WarehousePickerComponent } from '../warehouse-picker/warehouse-picker.component';
import { ClientPickerComponent } from './../client-picker/client-picker.component';
import { ProjectService } from '../../services/project.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalController, PopoverController } from '@ionic/angular';

import { Project } from 'src/app/_shared/models/Project/Project';

import { PickerComponent } from '../picker/picker.component';

import { User } from 'src/app/_shared/models/Auth/User';
import { Client } from 'src/app/_shared/models/Client';
import { CreateProjectDto } from '../../../../_shared/models/Project/CreateProjectDto';
import { ToastService } from '../../../../_shared/services/toast.service';
import { UpdateProjectDto } from '../../../../_shared/models/Project/UpdateProjectDto';
import { Warehouse } from '../../../../_shared/models/Warehouse/Warehouse';
import { projectStates, Types } from '../../../../_shared/constants/Constants';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss'],
})
export class ProjectEditorComponent implements OnInit {

  @Input() project: Project | undefined;

  client: Client | undefined;
  warehouse: Warehouse | undefined;

  editorForm: FormGroup;
  editorFormActive = false;
  submitted = false;
  pageProjectPopover: any;

  clientPicker: any;
  warehousePicker: any;

  types = Types;
  projectStates = projectStates;

  constructor(private formBuilder: FormBuilder,
              private modalController: ModalController,
              private popoverController: PopoverController,
              private projectService: ProjectService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.client = this.project?.client;
    this.warehouse = this.project?.warehouse;

    this.buildEditorForm();
  }

  onSubmit() {

    if (this.editorForm.invalid) {
      this.submitted = true;
      return;
    }

    if (this.project === undefined) {

      //TODO: when implement on back, test
      this.projectService.store(this.editorForm.value as CreateProjectDto).subscribe(
        result => {
          this.toastService.showSuccess('Projekat je uspešno dodat u sistem!');
          this.editorForm.reset();
          this.modalController.dismiss({result});
        },
        error => {
          // TODO handle error
          // this.toastService.showError(error);
        }
      );
    } else {
      this.projectService.update(this.editorForm.value as UpdateProjectDto).subscribe(
        result => {
          this.toastService.showSuccess('Projekat je uspešno ažuriran!');
          this.editorForm.reset();
          this.modalController.dismiss(result);
        },
        error => {
          // TODO handle error
          // this.toastService.showError(error);
        }
      );
    }

  }

  buildEditorForm(): void {

    this.editorForm = this.formBuilder.group({
      id:           [this.project ? this.project.id           : null],
      title:        [this.project ? this.project.title        : '', Validators.required],
      clientId:     [this.project ? this.project.client.id    : null, Validators.required],
      warehouseId:  [this.project ? this.project.warehouse.id : null, Validators.required],
      state:        [this.project ? this.project.state        : null, (this.project ? Validators.required : null)]
    });

    this.editorFormActive = true;
  }

  async openClientPicker(){

    const isNew = !this.project;

    this.clientPicker = await this.popoverController.create({
      component: ClientPickerComponent,
      componentProps: {
        isNew
      }
    });

    this.clientPicker.onDidDismiss().then(
      result =>{
        if(result.data?.dismissed)
        {
          return;
        }

        if (!result.data) {
          return;
        }

        this.client = result.data;
        this.editorForm.controls.clientId.setValue(this.client.id);

      }
    );

    await this.clientPicker.present();
  }

  async openWarehousePicker(){

    const isNew = !this.project;

    this.warehousePicker = await this.popoverController.create({
      component: WarehousePickerComponent,
      componentProps: {
        isNew
      }
    });

    this.warehousePicker.onDidDismiss().then(
      result =>{
        if(result.data?.dismissed)
        {
          return;
        }

        if (!result.data) {
          return;
        }

        this.warehouse = result.data;
        this.editorForm.controls.warehouseId.setValue(this.warehouse.id);

      }
    );

    await this.warehousePicker.present();
  }


  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
