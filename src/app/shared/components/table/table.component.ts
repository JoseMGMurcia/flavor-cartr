import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { TableAlingEnum, TableColumn, TableColumnTypeEnum, TableConfig, TablePageSizesEnum, TableRow } from '@shared/models/table.models';
import { cutString } from '@shared/utils/string.utils';
import { CartOption } from '../select/select.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, OnChanges{
  @Input({required: true}) tableConfig!: TableConfig;
  @Input({required: true}) tableData!: TableRow[];

  currentPageData!: TableRow[];
  NUMBERS = NUMBERS;
  sizeOptions: CartOption[] = [
    {label: '5', value: `${TablePageSizesEnum.T5}`},
    {label: '10', value: `${TablePageSizesEnum.T10}`},
    {label: '20', value: `${TablePageSizesEnum.T20}`, selected: true},
    {label: '50', value: `${TablePageSizesEnum.T50}`},
  ];

  tableAling = TableAlingEnum;
  tableColumnTypeEnum = TableColumnTypeEnum;

  get totalPages(): number {
    return Math.ceil(this.tableConfig.pagination.totalItems / this.tableConfig.pagination.itemsPerPage);
  }

  ngOnInit(): void {
    this.currentPageData = this.tableData.slice(
      (this.tableConfig.pagination.actualPage - NUMBERS.N_1) * this.tableConfig.pagination.itemsPerPage,
      this.tableConfig.pagination.actualPage * this.tableConfig.pagination.itemsPerPage
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.currentPageData = this.tableData.slice(
        (this.tableConfig.pagination.actualPage - NUMBERS.N_1) * this.tableConfig.pagination.itemsPerPage,
        this.tableConfig.pagination.actualPage * this.tableConfig.pagination.itemsPerPage
      );
    }

    if (changes['tableConfig']) {
      this.sizeOptions = this.sizeOptions.map((option: CartOption) => {
        return {
          ...option,
          selected: option.value === `${this.tableConfig.pagination.itemsPerPage}`,
        };
      });
    }
  }

  changePage(page: number): void {
    this.tableConfig.pagination.actualPage = page;
    this.currentPageData = this.tableData.slice(
      (this.tableConfig.pagination.actualPage - NUMBERS.N_1) * this.tableConfig.pagination.itemsPerPage,
      this.tableConfig.pagination.actualPage * this.tableConfig.pagination.itemsPerPage
    );
  }

  changePageSize(size: string): void {
    this.tableConfig.pagination.itemsPerPage = Number(size);
    this.changePage(NUMBERS.N_1);
  }

  getHeaderClass(columnIndex: number): string {
    const roundRight = columnIndex === this.tableConfig.columns.length - NUMBERS.N_1 ? 'round-right' : STRING_EMPTY;
    return columnIndex === NUMBERS.N_0 ? 'round-left' : roundRight;
  }

  getRowClass(rowIndex: number, columnIndex: number): string {
    const roundRight = columnIndex === this.tableConfig.columns.length - NUMBERS.N_1 ? 'round-right' : STRING_EMPTY;
    const round = columnIndex === NUMBERS.N_0 ? 'round-left' : roundRight;
    const evenOdd = rowIndex %  NUMBERS.N_2 === NUMBERS.N_0 ? 'even' : 'odd';
    const lastPageRow = this.isMultipleOf(rowIndex + NUMBERS.N_1, this.tableConfig.pagination.itemsPerPage);
    const lastRow = rowIndex === this.currentPageData.length - NUMBERS.N_1;
    return `${evenOdd} ${lastPageRow || lastRow ? round : STRING_EMPTY}`;
  }

  doAction(row: TableRow, column: TableColumn): void {
    if (column.action) {
      column.action(row);
    }
  }

  cutString(value: string, maxChars: number | undefined): string {
    return (value && maxChars) ? cutString(value, maxChars): value;
  }

  private isMultipleOf(number: number, multiple: number): boolean {
    return number % multiple === NUMBERS.N_0;
  }
}