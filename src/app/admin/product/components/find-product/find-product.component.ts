import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Product } from '../../../../_shared/models/Product/Product';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TaskService } from '../../../../worker/task/services/task.service';
import { Task } from '../../../../_shared/models/Task/Task';
import { ToastService } from '../../../../_shared/services/toast.service';
import * as moment from "moment";

@Component({
  selector: 'app-find-product',
  templateUrl: './find-product.component.html',
  styleUrls: ['./find-product.component.scss'],
})
export class FindProductComponent implements OnInit {

  @Input() product: Product;
  filter: FormControl;
  paginationConfig = {
    pageIndex: 0,
    pageSize: 5,
    total: undefined
  };
  loading = false;
  tasks: Task[] = undefined;

  constructor(private modalController: ModalController,
              private taskService: TaskService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildFilter();
  }

  buildFilter(): void {

    this.filter = new FormControl('');

    this.filter.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged())
      .subscribe(value => {
        this.paginationConfig.pageIndex = 0;
        this.fetchTasks();
      });

    this.fetchTasks();
  }

  fetchTasks(): void {
    this.loading = true;
    this.taskService.findProduct(this.product.id, this.filter.value, this.paginationConfig.pageIndex, this.paginationConfig.pageIndex).subscribe(
      result => {
        this.tasks = result.items.map(task => {
          return {
            ...task,
            createdAt: moment(task.createdAt).format('MMMM Do YYYY')
          };
        });
        this.paginationConfig.total = result.total;
      },
      error => {
        this.toastService.showError(error.error.message);
      },
      () => this.loading = false
    );
  }

  dismiss(): void {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  changePage(next: boolean): void {
    this.paginationConfig.pageIndex = (next ? this.paginationConfig.pageIndex + 1 : this.paginationConfig.pageIndex - 1);
    this.fetchTasks();
  }
}
