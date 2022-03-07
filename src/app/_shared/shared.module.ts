import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { DeletePickerComponent } from './components/delete-picker/delete-picker.component';
import { PdfUploaderComponent } from './components/pdf-uploader/pdf-uploader.component';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [DeletePickerComponent, PdfUploaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    SwiperModule
  ],
  providers:    [
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi:    true
    }
  ],
  exports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule,
    SwiperModule,
    PdfUploaderComponent
  ]
})
export class SharedModule { }
