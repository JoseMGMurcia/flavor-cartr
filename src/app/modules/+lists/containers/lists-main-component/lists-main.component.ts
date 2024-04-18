import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Article, Category } from '@shared/models/cart.models';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { ModalService } from '@shared/services/modal.service';
import { ModalOptions } from '@shared/models/modal.model';
import { AddListComponent } from '@modules/+lists/components/add-list/add-list.component';

@Component({
  selector: 'app-lists-main-component',
  templateUrl: './lists-main.component.html',
  styleUrl: './lists-main.component.scss'
})
export class ListsMainComponent implements OnInit{

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();
  private _articles: Article[] = [];
  private _categories: Category[] = [];
  private _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.fetch();
  }

  constructor(
    private translate: TranslateService,
    private loading: LoadingService,
    private cartService: CartService,
    private modalService: ModalService,
  ) { }

  handleNewList(): void {
    const options: ModalOptions = {
      animations: {
        modal: {
          enter: 'enter-scaling 0.4s',
        },
      },
    };
    this.modalService.open(AddListComponent, options);
  }

  private fetch(): void {
    this.loadProducts();
    this.loadCategosies();
  }

  private loadProducts(): void {
    // this.loading.show();
    // this.cartService.getArticles()
    //   .pipe(takeUntilDestroyed(this._destroyRef),
    //     finalize(() => this.loading.hide()))
    //   .subscribe({
    //     next: (articles: Article[]) => {
    //       this._articles = articles;
    //       this.tableData = this._articles.map((article: Article) => ({
    //         id: article.id,
    //         name: article.name,
    //         category: STRING_EMPTY,
    //         quantity: NUMBERS.N_0,
    //       }));
    //     }
    //   });
  }

  private loadCategosies(): void {
    this.loading.show();
    this.cartService.getCategories()
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (categories: Category[]) => {
          this._categories = categories;
        }
      });
  }

  private getTableConfig(): TableConfig {
    const literals = this.translate.instant('LISTS.HEADERS');
    return {
      columns: [
        {
          key: 'name',
          label: literals.NAME,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'category',
          label: literals.CATEGORY,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'quantity',
          label: literals.QUANTITY,
          type: TableColumnTypeEnum.TEXT,
          aling: TableAlingEnum.CENTER,
        },
        {
          key: 'detail',
          label: literals.DETAIL,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => row['quantity'] = Number(row['quantity']) + NUMBERS.N_1,
        }

      ],
      pagination: {
        actualPage: NUMBERS.N_1,
        itemsPerPage: NUMBERS.N_5 ,
        totalItems: this.tableData.length,
      }
    }
  }
}
