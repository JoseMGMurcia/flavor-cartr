import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { Article, Category, List } from '@shared/models/cart.models';
import { IconEmum } from '@shared/models/icon.models';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input({required: true}) list!: List;
  @Input({required: true}) articles!: Article[];
  @Input({required: true}) categories!: Category[];

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();

  constructor(
    private translate: TranslateService,
  ) {}

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
