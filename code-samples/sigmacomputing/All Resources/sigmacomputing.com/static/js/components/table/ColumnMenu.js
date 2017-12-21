// @flow
import React, { Component } from 'react';
import type { Query, Format } from '@sigmacomputing/sling';
import moment from 'moment-strftime';

import { Menu } from 'widgets';
import 'antd/lib/dropdown/style/index.less';
import type { Id, SelectedColumns, Selection, ColumnTypes } from 'types';
import * as actions from 'utils/ColumnActions';
import { DATETIME_FORMATS } from 'utils/format';
const { MenuItem, MenuDivider, SubMenu } = Menu;
const DATE_PART = 'DatePart';
const DATE_TRUNC = 'DateTrunc';

// Mon Jun 12 2017 12:23:12 PM in ISO8601
const EXAMPLE_DATE = '2017-06-12T19:23:12.000Z';

function hasId(arr = [], id) {
  return arr.includes(id);
}

function getDisabledActions(
  query: Query,
  columnId: ?Id,
  levelId: ?Id,
  selectedIds: Array<Id>
) {
  const disabled = {};
  // If the menu is not open then query / columnId may not be set yet
  if (!query || !columnId || !levelId || !query.columns[columnId]) {
    return disabled;
  }

  const level = query.getLevel(levelId);
  const columns = query.columns;
  const isSelected = selectedIds.includes(columnId);
  const sourceColumns = level.columns.filter(id => columns[id].isGrouped);
  const multiSelect = isSelected && selectedIds.length > 1;

  // cannot hide the source columns
  if (!isSelected) {
    disabled.hideColumn = hasId(sourceColumns, columnId);
  } else {
    disabled.hideColumn = selectedIds.some(id => hasId(sourceColumns, id));
  }

  // cannot delete columns which are grouped
  if (!isSelected) {
    disabled.deleteColumn = query.columns[columnId].isGrouped;
  } else {
    disabled.deleteColumn = selectedIds.some(id => query.columns[id].isGrouped);
  }

  // rename, duplicate, filter, aggregate, extract, truncate, and format only on a single column
  disabled.rename = multiSelect;
  disabled.duplicateColumn = multiSelect;
  disabled.filterColumn = multiSelect;
  disabled.extract = multiSelect;
  disabled.truncate = multiSelect;

  // sort only on a single column that is not at the global level
  disabled.sortColumn = multiSelect || level.id === 'global';
  disabled.aggregate = multiSelect || level.id === 'global';

  return disabled;
}

type Props = {
  query: Query,
  setQuery: Query => void,
  selectColumns: Selection => void,
  deselectColumns: (Array<Id>) => void,
  selectedColumns: SelectedColumns,
  onRename?: (columnId: Id) => void,
  showColumnMultiSorterModal: () => void,
  columnTypes: ColumnTypes,
  columnId: ?Id,
  levelId: ?Id
};

function formatDateTimeExample(format) {
  return moment(EXAMPLE_DATE).strftime(format);
}

export default class ColumnMenu extends Component<Props> {
  menu: any;

  addDateModifiedColumn = (action: string, part: string, format?: Format) => {
    const { selectColumns, query, columnId, levelId } = this.props;

    const levelIdx = levelId || 0;
    if (!columnId) return;
    return actions.addDateModifiedColumn(
      query,
      columnId,
      levelIdx,
      selectColumns,
      part,
      action,
      format
    );
  };

  onMenuAction = (action: string) => {
    const {
      selectedColumns,
      selectColumns,
      deselectColumns,
      query,
      columnTypes,
      onRename,
      showColumnMultiSorterModal,
      columnId,
      levelId
    } = this.props;

    if (!columnId) return;

    const levelIdx = levelId || 0;
    const isSelected = selectedColumns ? selectedColumns[columnId] : false;

    // for actions that affect all selected columns
    const multColumnIds = isSelected
      ? Object.keys(selectedColumns)
      : [columnId];

    let newQuery;
    switch (action) {
      case 'rename': {
        // Rename is special because it just focuses the name
        // The actual query update happens after the input is accepted
        if (columnId && onRename) {
          onRename(columnId);
        }
        return;
      }
      case 'addColumn':
        newQuery = actions.addColumn(
          query,
          levelIdx,
          selectColumns,
          multColumnIds
        );
        break;
      case 'duplicateColumn':
        newQuery = actions.duplicateColumn(
          query,
          levelIdx,
          selectColumns,
          columnId
        );
        break;
      case 'deleteColumn':
        newQuery = actions.deleteColumn(query, multColumnIds);
        break;
      case 'hideColumn':
        newQuery = actions.hideColumn(query, multColumnIds, deselectColumns);
        break;
      case 'filter':
        // XXX JDF: this wipes out any existing filter
        newQuery = actions.addFilter(
          query,
          columnTypes ? columnTypes[columnId] : undefined,
          columnId
        );
        break;
      case 'sortColumnAsc':
        newQuery = actions.sortColumnAsc(query, levelIdx, columnId);
        break;
      case 'sortColumnDesc':
        newQuery = actions.sortColumnDesc(query, levelIdx, columnId);
        break;
      case 'multiSortColumn':
        showColumnMultiSorterModal();
        break;
      // format numbers
      case 'fmtText':
        newQuery = actions.columnFormat(query, selectedColumns, 'text');
        break;
      case 'fmtNumber':
        newQuery = actions.columnFormat(query, selectedColumns, 'number');
        break;
      case 'fmtPercent':
        newQuery = actions.columnFormat(query, selectedColumns, 'percent');
        break;
      case 'fmtScientific':
        newQuery = actions.columnFormat(query, selectedColumns, 'scientific');
        break;
      case 'fmtCurrency':
        newQuery = actions.columnFormat(query, selectedColumns, 'currency');
        break;
      //fmt dates
      case 'fmtShortDate':
        newQuery = actions.columnFormat(query, selectedColumns, {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtShortDate
        });
        break;
      case 'fmtLongDate':
        newQuery = actions.columnFormat(query, selectedColumns, {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtLongDate
        });
        break;
      case 'fmtFullDate':
        newQuery = actions.columnFormat(query, selectedColumns, {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtFullDate
        });
        break;
      case 'fmtMonthYear':
        newQuery = actions.columnFormat(query, selectedColumns, {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtMonthYear
        });
        break;
      case 'fmtMonthDay':
        newQuery = actions.columnFormat(query, selectedColumns, {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtMonthDay
        });
        break;
      case 'fmtDateTime':
        newQuery = actions.columnFormat(query, selectedColumns, {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtDateTime
        });
        break;
      case 'fmtTime':
        newQuery = actions.columnFormat(query, selectedColumns, {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtTime
        });
        break;
      // dateparts
      case 'datepartSecond':
        newQuery = this.addDateModifiedColumn(DATE_PART, 'Second');
        break;
      case 'datepartMinute':
        newQuery = this.addDateModifiedColumn(DATE_PART, 'Minute');
        break;
      case 'datepartHour':
        newQuery = this.addDateModifiedColumn(DATE_PART, 'Hour');
        break;
      case 'datepartDay':
        newQuery = this.addDateModifiedColumn(DATE_PART, 'Day');
        break;
      case 'datepartWeekday':
        newQuery = this.addDateModifiedColumn(DATE_PART, 'Weekday');
        break;
      case 'datepartWeek':
        newQuery = this.addDateModifiedColumn(DATE_PART, 'Week');
        break;
      case 'datepartMonth':
        newQuery = this.addDateModifiedColumn(DATE_PART, 'Month');
        break;
      case 'datepartYear':
        newQuery = this.addDateModifiedColumn(DATE_PART, 'Year');
        break;
      // truncate dates
      case 'datetruncSecond':
        newQuery = this.addDateModifiedColumn(DATE_TRUNC, 'Second', {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtDateTime
        });
        break;
      case 'datetruncMinute':
        newQuery = this.addDateModifiedColumn(DATE_TRUNC, 'Minute', {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtDateTime
        });
        break;
      case 'datetruncHour':
        newQuery = this.addDateModifiedColumn(DATE_TRUNC, 'Hour', {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtDateTime
        });
        break;
      case 'datetruncDay':
        newQuery = this.addDateModifiedColumn(DATE_TRUNC, 'Day', {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtLongDate
        });
        break;
      case 'datetruncWeek':
        newQuery = this.addDateModifiedColumn(DATE_TRUNC, 'Week', {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtLongDate
        });
        break;
      case 'datetruncMonth':
        newQuery = this.addDateModifiedColumn(DATE_TRUNC, 'Month', {
          type: 'datetime',
          format: DATETIME_FORMATS.fmtMonthYear
        });
        break;
      case 'datetruncYear':
        newQuery = this.addDateModifiedColumn(DATE_TRUNC, 'Year', {
          type: 'datetime',
          format: DATETIME_FORMATS.truncYear
        });
        break;
      // aggregates
      case 'avg':
      case 'count':
      case 'min':
      case 'max':
      case 'sum':
        newQuery = actions.addAggregateColumn(
          query,
          columnId,
          levelIdx,
          selectColumns,
          action
        );
        break;
      default:
        throw new Error(`Missing Menu key: ${action}`);
    }
    if (newQuery) this.props.setQuery(newQuery);
  };

  render() {
    const {
      query,
      selectedColumns,
      onRename,
      columnTypes,
      columnId,
      levelId
    } = this.props;

    if (!columnId) return null;

    const selectedIds = selectedColumns ? Object.keys(selectedColumns) : [];
    const disabled = getDisabledActions(query, columnId, levelId, selectedIds);
    const isHidden = Boolean(
      columnId && query.columns[columnId] && query.columns[columnId].isHidden
    );
    const isSelected = Boolean(
      selectedColumns && columnId && selectedColumns[columnId]
    );
    const columnLabel =
      selectedIds.length > 1 && isSelected ? 'Columns' : 'Column';
    const columnType =
      (columnId && columnTypes && columnTypes[columnId]) || 'text';

    return (
      <Menu onMenuItemClick={this.onMenuAction}>
        <MenuItem id="addColumn" name="Add Column" />
        {onRename && (
          <MenuItem
            id="rename"
            name="Rename Column"
            disabled={disabled.rename}
          />
        )}
        <MenuItem
          id="duplicateColumn"
          name={`Duplicate ${columnLabel}`}
          disabled={disabled.duplicateColumn}
        />

        <MenuDivider />
        <MenuItem
          id="hideColumn"
          name={isHidden ? `Show ${columnLabel}` : `Hide ${columnLabel}`}
          disabled={disabled.hideColumn}
        />
        <MenuItem
          id="deleteColumn"
          name={`Delete ${columnLabel}`}
          disabled={disabled.deleteColumn}
        />

        <MenuDivider />
        <MenuItem
          id="filter"
          name="Filter..."
          disabled={!columnTypes || disabled.filterColumn}
        />

        <MenuDivider />
        <MenuItem
          id="sortColumnAsc"
          name="Sort Ascending"
          disabled={disabled.sortColumn}
        />
        <MenuItem
          id="sortColumnDesc"
          name="Sort Descending"
          disabled={disabled.sortColumn}
        />
        <MenuItem
          id="multiSortColumn"
          name="Sorting..."
          disabled={disabled.sortColumn}
        />

        <MenuDivider />
        <SubMenu
          id="aggregate"
          name="Aggregate Column"
          disabled={disabled.aggregate}
        >
          {columnType === 'number' && <MenuItem id="avg" name="Avg" />}
          <MenuItem id="count" name="Count" />
          <MenuItem id="max" name="Max" />
          <MenuItem id="min" name="Min" />
          {columnType === 'number' && <MenuItem id="sum" name="Sum" />}
        </SubMenu>

        {columnType === 'datetime' && <MenuDivider />}
        {columnType === 'datetime' && (
          <SubMenu
            id="extract datepart"
            name="Extract Date Part"
            disabled={disabled.extract}
          >
            <MenuItem id="datepartSecond" name="Second" example="5" />
            <MenuItem id="datepartMinute" name="Minute" example="3" />
            <MenuItem id="datepartHour" name="Hour" example="11" />
            <MenuItem id="datepartDay" name="Day" example="5" />
            <MenuItem id="datepartWeekday" name="Weekday" example="4" />
            <MenuItem id="datepartWeek" name="Week" example="14" />
            <MenuItem id="datepartMonth" name="Month" example="4" />
            <MenuItem id="datepartYear" name="Year" example="2017" />
          </SubMenu>
        )}
        {columnType === 'datetime' && (
          <SubMenu
            id="truncate date"
            name="Truncate Date"
            disabled={disabled.truncate}
          >
            <MenuItem
              id="datetruncSecond"
              name="Second"
              example="2017-04-05 11:03:05"
            />
            <MenuItem
              id="datetruncMinute"
              name="Minute"
              example="2017-04-05 11:03:00"
            />
            <MenuItem
              id="datetruncHour"
              name="Hour"
              example="2017-04-05 11:00:00"
            />
            <MenuItem id="datetruncDay" name="Day" example="2017-04-05" />
            <MenuItem id="datetruncWeek" name="Week" example="2017-04-03" />
            <MenuItem id="datetruncMonth" name="Month" example="2017-04-01" />
            <MenuItem id="datetruncYear" name="Year" example="2017-01-01" />
          </SubMenu>
        )}

        {columnType === 'datetime' && <MenuDivider />}
        {columnType === 'datetime' && (
          <SubMenu id="format" name="Format">
            <MenuItem
              id="fmtShortDate"
              name="Short Date"
              example={formatDateTimeExample(DATETIME_FORMATS.fmtShortDate)}
            />
            <MenuItem
              id="fmtLongDate"
              name="Long Date"
              example={formatDateTimeExample(DATETIME_FORMATS.fmtLongDate)}
            />
            <MenuItem
              id="fmtFullDate"
              name="Full Date"
              example={formatDateTimeExample(DATETIME_FORMATS.fmtFullDate)}
            />

            <MenuItem
              id="fmtMonthYear"
              name="Month Year"
              example={formatDateTimeExample(DATETIME_FORMATS.fmtMonthYear)}
            />
            <MenuItem
              id="fmtMonthDay"
              name="Month Day"
              example={formatDateTimeExample(DATETIME_FORMATS.fmtMonthDay)}
            />
            <MenuDivider />
            <MenuItem
              id="fmtDateTime"
              name="Date Time"
              example={formatDateTimeExample(DATETIME_FORMATS.fmtDateTime)}
            />
            <MenuItem
              id="fmtTime"
              name="Time"
              example={formatDateTimeExample(DATETIME_FORMATS.fmtTime)}
            />
          </SubMenu>
        )}

        {columnType === 'number' && <MenuDivider />}
        {columnType === 'number' && (
          <SubMenu id="format" name="Format">
            <MenuItem id="fmtText" name="Text" example="1234.56" />
            <MenuDivider />
            <MenuItem id="fmtNumber" name="Number" example="1,234.56" />
            <MenuItem id="fmtPercent" name="Percent" example="12.34%" />
            <MenuItem id="fmtScientific" name="Scientific" example="1.23e4" />
            <MenuDivider />
            <MenuItem id="fmtCurrency" name="Currency" example="$123.45" />
          </SubMenu>
        )}
      </Menu>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/ColumnMenu.js