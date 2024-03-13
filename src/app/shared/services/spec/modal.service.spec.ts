import { TestBed } from '@angular/core/testing';
import { ModalService } from '../modal.service';
import { ComponentRef } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { DialogComponent } from '@shared/components/dialog/dialog.component';

describe('ModalService', () => {
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalService],
    });
    modalService = TestBed.inject(ModalService);
  });

  it('should create', () => {
    expect(modalService).toBeTruthy();
  });

  describe('easyDialog', () => {
    it('should open dialog with DialogOptions', () => {
      const dialogOptions = { title: 'Confirmation', message: 'Are you sure?' };

      spyOn(modalService, 'open');

      modalService.easyDialog(dialogOptions);

      expect(modalService.open).toHaveBeenCalledWith(DialogComponent, { dialog: dialogOptions });
    });
  });

  it('should call new modalComponent close', () => {
    const modalComponent = { instance: { close: jasmine.createSpy('close') } } as unknown as ComponentRef<ModalComponent>;
    modalService.newModalComponent = modalComponent;

    modalService.close();

    expect(modalComponent.instance.close).toHaveBeenCalled();
  });
});
