// @flow
import type { ValueType, Format } from '@sigmacomputing/sling';
import type { ValueColumnCell, ValueColumnData } from 'types/column';
import moment from 'moment-strftime';

const Intl = window.Intl;

export const LITERAL_TRUE = 'true';
export const LITERAL_FALSE = 'false';

export const FORMAT_TYPES = [
  'text',
  'number',
  'percent',
  'currency',
  'scientific'
];

export const DATETIME_FORMATS = {
  fmtDefault: '%Y-%m-%d %H:%M:%S',

  fmtShortDate: '%m/%d/%Y',
  fmtLongDate: '%B %d %Y',
  fmtFullDate: '%A %B %d %Y',
  fmtMonthYear: '%B %Y',
  fmtMonthDay: '%B %d',
  fmtDateTime: '%m/%d/%Y %I:%M:%S %p',
  fmtTime: '%I:%M:%S %p',

  truncYear: '%Y',
  truncMonth: '%m/%Y',
  truncDay: '%m/%d/%Y',
  truncHour: '%m/%d/%Y %I %p',
  truncMinute: '%m/%d/%Y %I:%M %p'
};

export const curFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const percFmt = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export const numFmt = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: undefined
});

export function formatCell(
  cell: ValueColumnCell,
  typ?: ?ValueType,
  format?: ?Format
): ?string {
  const [data, , multi] = cell;
  if (multi) {
    return '*';
  } else if (data != null) {
    return formatValue(data, typ, format);
  } else {
    return null;
  }
}

export function formatValue(
  data: ValueColumnData,
  typ?: ?ValueType,
  format?: ?Format
): ?string {
  switch (typ) {
    case 'number':
      return formatNumber(data, format);
    case 'datetime':
      return formatDatetime(data, format);
    case 'boolean':
      return data === true ? 'true' : data === false ? 'false' : null;
    case 'variant':
      return null;
    default:
      if (typ === 'text' || typ == null) {
        return formatText(data);
      } else {
        throw new Error(`Unexpected type ${typ}`);
      }
  }
}

function formatText(data: ValueColumnData): ?string {
  switch (typeof data) {
    case 'string':
      return data;
    case 'number':
      return `${data}`;
    case 'boolean':
      return data ? LITERAL_TRUE : LITERAL_FALSE;
    default:
      throw new Error(`Unexpected string literal ${data.toString()}`);
  }
}

function formatNumber(data: ValueColumnData, format: ?Format): ?string {
  const n = parseFloat(data);
  if (isNaN(n)) return null;

  switch (format) {
    case 'number':
      return numFmt.format(n);
    case 'currency':
      return curFmt.format(n);
    case 'percent':
      return percFmt.format(n);
    case 'scientific':
      return n.toExponential(2);
    default:
      return `${n}`;
  }
}

function formatDatetime(data: ValueColumnData, format: ?Format): ?string {
  const d = moment.utc(data);
  if (!d.isValid()) {
    return null;
  }

  if (format && typeof format.format === 'string') {
    return d.strftime(format.format);
  } else {
    return d.strftime(DATETIME_FORMATS.fmtDefault);
  }
}



// WEBPACK FOOTER //
// ./src/utils/format.js