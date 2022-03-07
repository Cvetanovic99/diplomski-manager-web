import { ClientService } from './../../../client/services/client.service';
import { Client } from './../../../../_shared/models/Client';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-client-picker',
  templateUrl: './client-picker.component.html',
  styleUrls: ['./client-picker.component.scss'],
})
export class ClientPickerComponent implements OnInit {

  @Input() isNew = undefined;
  clients: Client[];

  filter: FormControl;
  pickerFormActive = false;
  submitted = false;
  loading = false;
  pickerPaginationConfig = {
    pageIndex: 0,
    pageSize: 5,
    total: undefined
  };


  constructor(
              private clientService: ClientService,
              private popoverController: PopoverController) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildFilter();
    this.fetchClients();
  }


  buildFilter(): void {

    this.filter = new FormControl('');

    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.pickerPaginationConfig.pageIndex = 0;
        this.fetchClients();
      });

    this.fetchClients();
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  changePage(next: boolean): void {
    this.pickerPaginationConfig.pageIndex = (next ? this.pickerPaginationConfig.pageIndex + 1 : this.pickerPaginationConfig.pageIndex - 1);
    this.fetchClients();
  }


  // eslint-disable-next-line @typescript-eslint/member-ordering
  pick(result: Client) {
     this.popoverController.dismiss(result);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  dismiss(): void {
    this.popoverController.dismiss({
      dismissed: true
    });
  }


}
