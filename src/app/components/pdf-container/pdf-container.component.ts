import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NUMBERS } from 'app/constants/number.constants';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { ModalDataGet } from 'app/models/modal.model';
import { ModalService } from 'app/services/modal.service';

@Component({
  selector: 'app-pdf-container',
  templateUrl: './pdf-container.component.html',
  styleUrl: './pdf-container.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
  ]
})
// This component is used to display the pdf file
export class PdfContainerComponent extends ModalDataGet implements OnInit{
  listPreview = STRING_EMPTY;

  private _file!: File;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private modalService: ModalService,
  ) {
    super();
   }

  ngOnInit(): void {
    this.fetch();
  }

  // Close the modal
  handleCancel(): void {
    this.modalService.close();
  }

  // Fetch the file
  private fetch(): void {
    if (!this.data || !this.data['file']) {
      return;
    }
    this._file = this.data['file'];
    this.listPreview = this.data['name'];
    this.renderPdf();
  }

  // Render the pdf file in the component view after fetching it
  private renderPdf(): void {
    const obj = this.document.createElement('object');
    obj.style.width = '100%';
    obj.style.height = 'calc(70dvh - 102px)';
    obj.type = 'application/pdf';
    obj.data = URL.createObjectURL(this._file);

    // Hide toolbar
    obj.setAttribute('toolbar', '0');

    // Append the object to the pdf-container
    this.document.getElementsByClassName('pdf-container')[NUMBERS.N_0]?.appendChild(obj);
  }
}
