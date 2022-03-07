import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalController } from '@ionic/angular';

import { Client } from '../../../../_shared/models/Client';

import {ClientService} from '../../services/client.service';
import {ToastService} from '../../../../_shared/services/toast.service';

@Component({
  selector: 'app-client-editor',
  templateUrl: './client-editor.component.html',
  styleUrls: ['./client-editor.component.scss'],
})
export class ClientEditorComponent implements OnInit {


  @Input() client: Client | undefined;

  editorForm: FormGroup;
  editorFormActive = false;
  submitted = false;
  loading = false;

  constructor(private formBuilder: FormBuilder,
              private modalController: ModalController,
              private clientService: ClientService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildEditorForm(this.client);
  }

  onSubmit() {

    if (this.editorForm.invalid) {
      this.submitted = true;
      return;
    }

    const client = this.editorForm.value as Client;

    this.loading = true;
    if (this.client === undefined) {
      this.clientService.store(client).subscribe(
        result => {
          this.toastService.showSuccess('Klijent je uspešno dodat u sistem!');
          this.editorForm.reset();
          this.modalController.dismiss(result as Client);
        },
        error => {
          // TODO handle error
          // this.toastService.showError(error);
        }
      );
    } else {
      this.clientService.update(client).subscribe(
        result => {
          this.toastService.showSuccess('Klijent je uspešno ažuriran!');
          this.editorForm.reset();
          this.modalController.dismiss(result as Client);
        },
        error => {
          // TODO handle error
          // this.toastService.showError(error);
        }
      );
    }


  }

  buildEditorForm(client?: Client) {
    this.editorForm = this.formBuilder.group({
      id:           [client ? client.id           : null],
      clientId:     [client ? client.clientId     : '', Validators.required],
      name:         [client ? client.name         : '', Validators.required],
      email:        [client ? client.email        : ''],
      address:      [client ? client.address      : ''],
      city:         [client ? client.city         : ''],
      phoneNumber:  [client ? client.phoneNumber  : ''],
    });

    this.editorFormActive = true;
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
