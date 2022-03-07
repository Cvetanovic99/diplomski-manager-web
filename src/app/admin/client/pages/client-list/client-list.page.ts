import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Client } from '../../../../_shared/models/Client';
import { ClientService } from '../../services/client.service';
import { ClientEditorComponent } from '../../components/client-editor/client-editor.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.page.html',
  styleUrls: ['./client-list.page.scss'],
})
export class ClientListPage implements OnInit {

  loading = false;
  clients: Client[] = undefined;
  paginationConfig = {
    pageIndex: 0,
    pageSize: 10,
    total: undefined
  };
  editorModal;
  filter: FormControl;

  constructor(private clientService: ClientService,
              private modalController: ModalController) { }
  ngOnInit(): void {
    this.buildFilter();
    this.fetchClients();
  }


  ionViewDidLeave() {

    this.loading = false;
    this.editorModal = undefined;
  }

  fetchClients() {
    this.loading = true;
    this.clientService.index(this.filter.value, this.paginationConfig.pageIndex, this.paginationConfig.pageSize).subscribe(
      result => {
        this.clients = result.items;
        this.paginationConfig.total = result.total;
      },
      error => {
        // TODO (handle-me)
      },
      () => this.loading = false
    );
  }

  changePage(next: boolean) {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchClients();
  }

  async openEditor(client?: Client) {
    this.editorModal = await this.modalController.create({
      component: ClientEditorComponent,
      componentProps: {
        client
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.editorModal.onDidDismiss().then((client: any) => {

      if(client.data?.dismissed)
      {
        return;
      }

      if(client.data !== undefined)
      {
          const checkIfClientExist: Client = this.clients.find(x => x.id === client.data.id);
          if(checkIfClientExist===undefined)
          {
            this.paginationConfig.total++;
            if(this.clients.length<this.paginationConfig.pageSize)
            {
              this.clients.push(client.data as Client);
            }
          }
          else{
            const index = this.clients.findIndex(cliente => cliente.id === client.data.id);
            this.clients[index] = client.data;
          }

      }
    });

    return await this.editorModal.present();
  }

  buildFilter() {

    this.filter = new FormControl('');
    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.paginationConfig.pageIndex = 0;
        this.fetchClients();
      });
  }
}
