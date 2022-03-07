import { PdfFile } from './../../models/PdfFile';
import { PdfFileService } from './../../services/pdf-file.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { DeletePickerComponent } from '../delete-picker/delete-picker.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pdf-uploader',
  templateUrl: './pdf-uploader.component.html',
  styleUrls: ['./pdf-uploader.component.scss'],
})
export class PdfUploaderComponent implements OnInit {

  @Input() pdfFile:      PdfFile    = undefined;
  @Input() projectId:    number = undefined;
  @Input() projectState = '';

  @ViewChild('pdfFileUpload', {static: false}) pdfFileUpload: ElementRef | undefined;

  deletePdfPicker;
  pdfFileError = '';

  loading = false;

  constructor(private pickerDeleteController: PopoverController,
              private pdfFileService: PdfFileService,
              private toastService: ToastService) { }

  ngOnInit() {}

  checkType( fileType: string ): boolean {

    if(fileType.includes('application/pdf')){
      return true;
    }
    return false;
  }

  addPdfFile(): void {

    const fileUpload = this.pdfFileUpload?.nativeElement;
    this.pdfFileError = '';

    fileUpload.onchange = () => {

      const pdfFile = fileUpload.files[0];

      if(this.checkType(pdfFile.type))
      {
        this.loading = true;

        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('projectId', this.projectId.toString());

        this.pdfFileService.upload(formData).subscribe(

          (response: PdfFile) =>{
            this.pdfFile = response;
            this.toastService.showSuccess('PDF fajl je uspešno dodat!');
          },
          error => {
            this.toastService.showError('PDF fajl nije dodat!');
          },
          () => { this.loading = false; }
        );
      }
      else
      {
        this.pdfFileError = `Tip fajla nije podržan!`;
      }
    };

    fileUpload.click();
  }

  async removePdfFile() {

    this.deletePdfPicker = await this.pickerDeleteController.create({
      component: DeletePickerComponent,
      componentProps : {}
    });

    this.deletePdfPicker.onDidDismiss().then((chose: any) => {

        if(chose.data)
        {
          this.loading = true;
          this.pdfFileService.delete(this.pdfFile.path).subscribe(
            response =>{
              this.toastService.showSuccess('PDF fajl je uspešno obrisan!');
              this.pdfFile = null;
            },
            error => {
              this.toastService.showError('PDF fajl nije obrisan!');
            },
            () => { this.loading = false; }
          );
        }
    });

    return await this.deletePdfPicker.present();
  }

  downloadPdfFile(): void
  {
    this.pdfFileService.download(this.pdfFile.path).subscribe((pdf: any)=>{

      const linkSource = `data:application/pdf;base64,${pdf}`;

      const downloadLink = document.createElement('a');
      downloadLink.href = linkSource;
      downloadLink.download = this.pdfFile.name;
      downloadLink.click();
    });
  }
}
