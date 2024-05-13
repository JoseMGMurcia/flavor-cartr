import { Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddListComponent } from '@modules/+lists/components/add-list/add-list.component';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { BUTTON_CLASS } from '@shared/constants/style.constants';
import { Article, Category, List, User } from '@shared/models/cart.models';
import { IconEmum } from '@shared/models/icon.models';
import { DEFAULT_MODAL_OPTIONS, DialogOptions } from '@shared/models/modal.model';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { StatusService } from '@shared/services/status.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { stringFrom } from '@shared/utils/string.utils';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input({required: true}) list!: List | undefined;
  @Input({required: true}) articles!: Article[];
  @Input({required: true}) categories!: Category[];
  @Input({required: true}) user!: User;

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();

  private _destroyRef = inject(DestroyRef);

  constructor(
    private cartService: CartService,
    private translate: TranslateService,
    private loading: LoadingService,
    private statusService: StatusService,
    private modalService: ModalService,
    private toast: ToastService,
  ) {}

  handleDeleteList(): void {
    const literals = this.translate.instant('LISTS.DELETE_LIST_DIALOG');
    const dialog: DialogOptions = {
      title: literals.TITLE,
      message: this.translate.instant('LISTS.DELETE_LIST_DIALOG.CONTENT', { name: stringFrom(this.list?.name) }),
      buttons: [
        {
          label: literals.CANCEL,
          action: () => this.modalService.close(),
          className: BUTTON_CLASS.SECONDARY
        },
        {
          label: literals.DELETE,
          action: () => this.deleteList(),
          className: BUTTON_CLASS.PRIMARY
        }
      ]
    }
    this.modalService.easyDialog(dialog);
  }

  handleAddArticle(): void {
    // TODO
  }

  handleDeleteArticle(row: TableRow): void {
    // TODO
  }

  handleEditList(): void {
    this.modalService.open(AddListComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: this.user.id, list: this.list },
      prevenCloseOutside: true,
    });
  }

  handleSaveList(): void {
    if (!this.list) {
      return;
    }
    this.loading.show();
    this.cartService.putList(this.list)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: () => {
          this.statusService.setReloadListsPending(true);
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.SAVE_LIST_OK'));
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.SAVE_LIST_KO')),
      });

  }

  private deleteList(): void {
    this.loading.show();
    this.cartService.deleteList(stringFrom(this.list?.id))
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: () => {
          this.statusService.setReloadListsPending(true);
          this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.DELETE_LIST_KO'));
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.DELETE_LIST_KO')),
      });
  }

  getTableConfig(): TableConfig {
    const literals = this.translate.instant('LISTS.HEADERS');
    return {
      columns: [
        {
          key: 'name',
          label: literals.NAME,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'brand',
          label: literals.BRAND,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'category',
          label: literals.CATEGORY,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'description',
          label: literals.DESCRIPTION,
          type: TableColumnTypeEnum.TEXT,
          maxChars: NUMBERS.N_20,
        },
        {
          key: 'quantity',
          label: literals.QUANTITY,
          type: TableColumnTypeEnum.TEXT,
          aling: TableAlingEnum.CENTER,
        },
        {
          key: 'averagePrice',
          label: literals.PRICE,
          type: TableColumnTypeEnum.TEXT,
          aling: TableAlingEnum.RIGHT,
        },
        {
          key: 'detail',
          label: literals.DETAIL,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => row['quantity'] = Number(row['quantity']) + NUMBERS.N_1,
          actionIcon: IconEmum.DETAIL ,
        }
      ],
      pagination: {
        actualPage: NUMBERS.N_1,
        itemsPerPage: NUMBERS.N_10,
        totalItems: this.tableData.length,
      }
    };
  }
}
