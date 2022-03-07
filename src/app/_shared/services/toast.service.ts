import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }


  public async showSuccess(message: string) {

    const toast = await this.toastController.create({
      message,
      color: 'success',
      position: 'top',
      duration: 2000,
      animated: true,
      keyboardClose: true,
    });
    await toast.present();
  }

  public async showError(message: string) {

    const toast = await this.toastController.create({
      message,
      color: 'danger',
      position: 'top',
      duration: 2000,
      animated: true,
      keyboardClose: true,
    });
    await toast.present();
  }
}
