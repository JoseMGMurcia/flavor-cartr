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

  handleCancel(): void {
    this.modalService.close();
  }

  private fetch(): void {
    if (!this.data || !this.data['file']) {
      return;
    }
    this._file = this.data['file'];
    this.listPreview = this.data['name'];
    this.renderPdf();
  }

  private renderPdf(): void {
    const obj = this.document.createElement('object');
    obj.style.width = '100%';
    obj.style.height = 'calc(70dvh - 102px)';
    obj.type = 'application/pdf';
    obj.data = URL.createObjectURL(this._file);

    // Hide toolbar
    obj.setAttribute('toolbar', '0');

    this.document.getElementsByClassName('pdf-container')[NUMBERS.N_0]?.appendChild(obj);
  }
}