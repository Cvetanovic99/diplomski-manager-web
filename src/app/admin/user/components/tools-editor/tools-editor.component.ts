import { UpdateUserDto } from './../../../../_shared/models/Auth/UpdateUserDto';
import { UserService } from './../../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/_shared/models/Auth/User';
import { ModalController } from '@ionic/angular';
import { ToastService } from 'src/app/_shared/services/toast.service';
import { UpdateUserTools } from 'src/app/_shared/models/UserUpdateTools';

@Component({
  selector: 'app-tools-editor',
  templateUrl: './tools-editor.component.html',
  styleUrls: ['./tools-editor.component.scss'],
})
export class ToolsEditorComponent implements OnInit {

  @Input() user: User | null;

  editorForm: FormGroup;
  editorFormActive = false;
  submitted = false;
  loading = false;
  pickerPopover;


  constructor(private formBuilder: FormBuilder,
              private modalController: ModalController,
              private userService: UserService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.buildEditorForm(this.user);
  }

  onSubmit() {

    if (this.editorForm.invalid) {
      this.submitted = true;
      return;
    }

    const newTools = this.editorForm.get('tools').value;

    const updateTools: UpdateUserTools ={
      id: this.user.id,
      tools: newTools
    } as unknown as UpdateUserTools;

    this.userService.updateTools(updateTools).subscribe(
      result => {
        this.toastService.showSuccess('Zaduženi alat je uspešno ažuriran!');
        this.editorForm.reset();
        this.modalController.dismiss(updateTools);
      },
      error => {
        // TODO handle error
        // this.toastService.showError(error);
      }
    );
    }

    buildEditorForm(user: User) {

      this.editorForm = this.formBuilder.group({
        id:    [user ? user.id : null],
        tools: [this.user.tools ? this.user.tools : ''],
      });

      this.editorFormActive = true;
    }

    dismiss(): void {
      this.modalController.dismiss({
        dismissed: true
      });

  }

}
