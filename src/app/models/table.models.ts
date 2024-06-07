import { IconType } from "../../app/models/icon.models";

export enum TableColumnTypeEnum {
  TEXT = 'text',
  DATE = 'date',
  ACTIONS = 'actions',
  NUMBER = 'number',
}

export type TableColumnType =
  TableColumnTypeEnum.TEXT |
  TableColumnTypeEnum.DATE |
  TableColumnTypeEnum.ACTIONS |
  TableColumnTypeEnum.NUMBER;

export enum TableAlingEnum {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export type TableAlingType =
  TableAlingEnum.LEFT |
  TableAlingEnum.CENTER |
  TableAlingEnum.RIGHT;

export interface TableColumn {
  key: string;
  label: string;
  type: TableColumnType;
  format?: string;
  aling?: TableAlingType;
  action?: (row: TableRow) => void;
  actionIcon?: IconType;
  maxChars?: number;
}

export interface TablePagination {
  actualPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface TableConfig {
  columns: TableColumn[];
  pagination: TablePagination;
}

export enum TableRowStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  WARNING = 'warning',
  ERROR = 'error',
}

export type TableRowStatusType =
  TableRowStatusEnum.ACTIVE |
  TableRowStatusEnum.INACTIVE |
  TableRowStatusEnum.WARNING |
  TableRowStatusEnum.ERROR;

export interface TableRow {
  id: string;
  status?: TableRowStatusType;
  [key: string]: any | undefined;
}

export enum TablePageSizesEnum {
  T5 = 5,
  T10 = 10,
  T20 = 20,
  T50 = 50,
}
