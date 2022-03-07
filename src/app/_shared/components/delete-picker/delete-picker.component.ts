import { Component, OnInit } from '@angular/core';
import { PickerController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-picker.component.html',
  styleUrls: ['./delete-picker.component.scss'],
})
export class DeletePickerComponent implements OnInit {

  constructor(
          private pickerDeleteController: PopoverController,
              ) { }

  ngOnInit() {}

  onChose(chose: boolean): void {
    this.pickerDeleteController.dismiss(chose);
  }

}
