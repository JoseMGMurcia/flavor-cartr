import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { NUMBERS } from 'app/constants/number.constants';
import { NotDisplayColumnsEnum, TableColumn, TableColumnTypeEnum, TableConfig, TablePageSizesEnum, TableRow } from 'app/models/table.models';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleChanges } from '@angular/core';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  const tableconfig: TableConfig = {
    columns: [],
    pagination: {
      actualPage: NUMBERS.N_1,
      itemsPerPage: NUMBERS.N_10,
      totalItems: NUMBERS.N_0
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableComponent,
        TranslateModule.forRoot(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.tableData = [];
    component.tableConfig = tableconfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should update currentPageData when tableData changes', () => {
      const newTableData: TableRow[] = [
        { id: '1', name: 'John' },
        { id: '2', name: 'Jane' },
      ];
      component.tableData = newTableData;
      const changes: SimpleChanges = {
        tableData: {
          currentValue: newTableData,
          previousValue: component.tableData,
          firstChange: false,
          isFirstChange: () => false,
        },
      };

      component.ngOnChanges(changes);

      expect(component.currentPageData).toEqual(newTableData);
    });

    it('should update sizeOptions when tableConfig changes', () => {
      const newTableConfig: TableConfig = {
        columns: [],
        pagination: {
          actualPage: NUMBERS.N_1,
          itemsPerPage: NUMBERS.N_20,
          totalItems: NUMBERS.N_0,
        },
      };
      const changes: SimpleChanges = {
        tableConfig: {
          currentValue: newTableConfig,
          previousValue: component.tableConfig,
          firstChange: false,
          isFirstChange: () => false,
        },
      };

      component.ngOnChanges(changes);

      expect(component.sizeOptions.length).toEqual(NUMBERS.N_4);
    });
  });

  it('should change the number of items per page', () => {
    const newSize = '20';
    const expectedItemsPerPage = Number(newSize);
    const expectedPage = NUMBERS.N_1;

    component.changePageSize(newSize);

    expect(component.tableConfig.pagination.itemsPerPage).toEqual(expectedItemsPerPage);
    expect(component.tableConfig.pagination.actualPage).toEqual(expectedPage);
  });

  it('should call the action function when doAction is called', () => {
    const row: TableRow = { id: '1', name: 'John' };
    const column: TableColumn = { label: 'Name', key: 'name', type: TableColumnTypeEnum.TEXT, action: jasmine.createSpy() };

    component.doAction(row, column);

    expect(column.action).toHaveBeenCalledWith(row);
  });

  describe('cutString', () => {
    it('should return the original string if it is shorter than the maxChars', () => {
      const value = 'Hello, world!';
      const maxChars = 20;

      const result = component.cutString(value, maxChars);

      expect(result).toEqual(value);
    });

    it('should return the original string if maxChars is not provided', () => {
      const value = 'Hello, world!';

      const result = component.cutString(value, undefined);

      expect(result).toEqual(value);
    });

    it('should return the cut string if it is longer than the maxChars', () => {
      const value = 'Hello, world!';
      const maxChars = 5;
      const expected = 'Hello...';

      const result = component.cutString(value, maxChars);

      expect(result).toEqual(expected);
    });

    it('should return an empty string if the value is empty', () => {
      const value = '';
      const maxChars = 10;

      const result = component.cutString(value, maxChars);

      expect(result).toEqual('');
    });
  });

  describe('isMultipleOf', () => {
    it('should return true if the number is a multiple of the given multiple', () => {
      const number = 10;
      const multiple = 5;

      const result = component['isMultipleOf'](number, multiple);

      expect(result).toBeTrue();
    });

    it('should return false if the number is not a multiple of the given multiple', () => {
      const number = 7;
      const multiple = 3;

      const result = component['isMultipleOf'](number, multiple);

      expect(result).toBeFalse();
    });

    it('should return true if the number is zero and the multiple is zero', () => {
      const number = 0;
      const multiple = 0;

      const result = component['isMultipleOf'](number, multiple);

      expect(result).toBeFalse();
    });

    it('should return true if the number is negative and the multiple is negative', () => {
      const number = -6;
      const multiple = -2;

      const result = component['isMultipleOf'](number, multiple);

      expect(result).toBeTrue();
    });

    it('should return false if the number is negative and the multiple is positive', () => {
      const number = -6;
      const multiple = 2;

      const result = component['isMultipleOf'](number, multiple);

      expect(result).toBeTrue();
    });
  });

});
