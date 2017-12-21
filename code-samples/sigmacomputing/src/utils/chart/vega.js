// @flow
import invariant from 'invariant';
import type { Format, Query, Id } from '@sigmacomputing/sling';
import type { ColumnTypes } from 'types';
import { DATETIME_FORMATS } from 'utils/format';

import type ChartConfig, { TooltipOptions } from './ChartConfig';
import type { MarkDef, FieldDef, BinDef } from './Chart';
import type { ChartIR, ClassifiedFields } from './ir';

type Tooltip = {
  field: Id,
  title: string,
  format?: string,
  formatType?: string
};

function genTitle(f: FieldDef, query: Query): string {
  if (f.type === 'field') {
    let title = query.view.labels[f.columnId];
    if (f.bin) {
      title = `${f.bin}(${title})`;
    }

    if (f.func) {
      title = `${f.func}(${title})`;
    }
    return title;
  } else if (f.type === 'count') {
    return 'Count';
  }
  throw new Error(`NYI - ${f.type}`);
}

function getDateFormat(bin?: BinDef, colFormat: ?Format) {
  switch (bin) {
    case 'year':
      return DATETIME_FORMATS.truncYear;
    case 'month':
      return DATETIME_FORMATS.truncMonth;
    case 'day':
      return DATETIME_FORMATS.truncDay;
    case 'hour':
      return DATETIME_FORMATS.truncHour;
    case 'minute':
      return DATETIME_FORMATS.truncMinute;
    default:
      if (
        colFormat &&
        typeof colFormat !== 'string' &&
        colFormat.type === 'datetime'
      )
        return colFormat.format;
  }
  return;
}

function getFormat(query: Query, columnTypes: ColumnTypes, f: FieldDef) {
  let formatType;
  let format;
  if (f.type === 'field') {
    const { columnId } = f;
    const { formats = {} } = query.view;
    const colFormat = formats[columnId];
    const typ = columnTypes[columnId] || 'text';
    switch (typ) {
      case 'number':
        formatType = 'number';
        break;
      case 'datetime':
        formatType = 'time';
        format = getDateFormat(f.bin, colFormat);
        break;
      default:
        formatType = 'string';
        break;
    }
  }
  return { format, formatType };
}

function mkTooltip(
  query: Query,
  columnTypes: ColumnTypes,
  f: FieldDef
): Tooltip {
  const { format: _format, formatType } = getFormat(query, columnTypes, f);

  // vega-tooltip has some dubious logic to auto format datetime if formatType is
  // set but format string is not. So we always set it.
  let format = _format;
  if (formatType === 'time' && !format) {
    format = DATETIME_FORMATS.fmtDateTime;
  }

  return { field: f.id, title: genTitle(f, query), format, formatType };
}

function hasField(tips: Array<Tooltip>, ir: ChartIR, f: FieldDef) {
  const { fieldMap } = ir;
  for (const t of tips) {
    const tf = fieldMap[t.field];
    if (f.type === 'count') {
      if (tf.type === 'count') return true;
    } else if (f.type === 'field' && tf.type === 'field') {
      if (tf.columnId === f.columnId && tf.func === f.func && tf.bin === f.bin)
        return true;
    }
  }
  return false;
}

function addTooltip(
  tips: Array<Tooltip>,
  ir: ChartIR,
  query: Query,
  columnTypes: ColumnTypes,
  f: FieldDef
) {
  if (hasField(tips, ir, f)) return;
  tips.push(mkTooltip(query, columnTypes, f));
}

// For any encoded field, we need to tell vega-tooltip how to label it
export function generateTooltipOptions(
  ir: ChartIR,
  query: Query,
  tooltipOptions: TooltipOptions,
  columnTypes: ColumnTypes
) {
  if (tooltipOptions.hasTooltip === false) {
    return undefined;
  }

  const { layers, layerMap, fieldMap } = ir;
  const fields = [];

  for (const layerId of layers) {
    const layer = layerMap[layerId];
    invariant(layer, `Missing Layer: ${layerId}`);
    const { x, y, color, size } = layer;

    if (x && x.length > 0) {
      invariant(x.length === 1, `Multi-column axis NYI: ${x.length}`);
      const f = fieldMap[x[0]];
      invariant(f, `Missing field ${x[0]}`);
      addTooltip(fields, ir, query, columnTypes, f);
    }

    if (y && y.length > 0) {
      invariant(y.length === 1, `Multi-column axis NYI: ${y.length}`);
      const f = fieldMap[y[0]];
      invariant(f, `Missing field ${y[0]}`);
      addTooltip(fields, ir, query, columnTypes, f);
    }
    if (color && color.type === 'field') {
      const f = fieldMap[color.fieldId];
      invariant(f, `Missing field ${color.fieldId}`);

      addTooltip(fields, ir, query, columnTypes, f);
    }

    if (size) {
      const f = fieldMap[size.fieldId];
      invariant(f, `Missing field ${size.fieldId}`);

      addTooltip(fields, ir, query, columnTypes, f);
    }
  }

  return { fields };
}

function generateSort(field: FieldDef) {
  if (field.sort) {
    const { fieldId, isAsc } = field.sort;

    if (fieldId) {
      return {
        field: fieldId,
        // Using a random Op because this is required.
        // Chart-Eval already does agg for us so this isn't needed
        op: 'sum',
        order: isAsc ? 'ascending' : 'descending'
      };
    } else {
      return isAsc ? 'ascending' : 'descending';
    }
  }
  return 'ascending';
}

type VegaTimeUnit =
  | 'year'
  | 'yearmonth'
  | 'yearmonthdate'
  | 'yearmonthdatehours'
  | 'yearmonthdatehoursminutes'
  | 'yearmonthdatehoursseconds';

function getTimeUnit(
  f: FieldDef,
  columnTypes: ColumnTypes,
  fieldTypeById: ClassifiedFields
): ?VegaTimeUnit {
  // Forcibly set the timeUnit in vega only if we have a datetime column being used as a category
  // otherwise vega's defaults are better
  if (
    f.type !== 'field' ||
    columnTypes[f.columnId] !== 'datetime' ||
    fieldTypeById[f.id] !== 'ordinal'
  ) {
    return null;
  }

  if (!f.bin) return 'yearmonthdatehoursseconds';

  switch (f.bin) {
    case 'year':
      return 'year';
    case 'month':
      return 'yearmonth';
    case 'day':
      return 'yearmonthdate';
    case 'hour':
      return 'yearmonthdatehours';
    case 'minute':
      return 'yearmonthdatehoursminutes';
    case 'second':
      return 'yearmonthdatehoursseconds';
    default:
      throw new Error(`Unexpected timeunit ${f.bin}`);
  }
}

// XXX: Need to write a type
export type VegaEncoding = Object;
export type VegaSelection = Object;
export type VegaResolution = Object;

type AxisResolution = {
  bottom: boolean,
  left: boolean
};

export type VegaLayer = {|
  mark: MarkDef,
  encoding: VegaEncoding,
  selection?: VegaSelection
|};

export type VegaNestedLayer = {|
  layer: Array<VegaNestedLayer | VegaLayer>,
  resolve?: VegaResolution
|};

export type VegaConfig = {|
  legend: {
    orient?: string,
    labelFontSize?: number,
    titleFontSize?: number
  },
  axis: {
    titleFontSize?: number
  },
  axisX: {
    labelFontSize?: number
  },
  axisY: {
    labelFontSize?: number
  },
  padding: number,
  title: {
    fontSize?: number
  },
  view: {
    stroke: string
  }
|};

export type VegaSpec = {|
  config: VegaConfig,
  title: ?string,
  layer: Array<VegaNestedLayer | VegaLayer>,
  resolve?: VegaResolution
|};

export type EncodedLayerDef = {|
  encoding: VegaNestedLayer | VegaLayer,
  axis: AxisResolution
|};

export function encodeLayer(
  ir: ChartIR,
  config: ChartConfig,
  layerId: Id,
  query: Query,
  columnTypes: ColumnTypes,
  isThumbnail: boolean
): ?EncodedLayerDef {
  const layer = ir.layerMap[layerId];
  invariant(layer, `Missing Layer: ${layerId}`);

  const encoding = {};
  const axis = { bottom: true, left: true }; // default

  // Encode the channels
  const { fieldMap, fieldTypeById } = ir;
  const { x, y, color, size, mark } = layer;
  invariant(mark, `Encoded ChartIR with missing mark!`);

  if (x && x.length > 0) {
    invariant(x.length === 1, `Multi-column axis NYI: ${x.length}`);
    const f = fieldMap[x[0]];
    invariant(f, `Missing field: ${x[0]}`);
    const { format } = getFormat(query, columnTypes, f);

    encoding.x = {
      sort: generateSort(f),
      field: f.id,
      timeUnit: getTimeUnit(f, columnTypes, fieldTypeById),
      type: fieldTypeById[f.id],
      axis: isThumbnail
        ? null
        : {
            labels: true,
            title: config.axisTitle.xTitle || genTitle(f, query),
            format
          }
    };
    if (f.resolution && f.resolution === 'secondary') {
      axis.left = false;
    }
  }
  if (y && y.length > 0) {
    invariant(y.length === 1, `Multi-column axis NYI: ${y.length}`);
    const f = fieldMap[y[0]];
    invariant(f, `Missing field: ${y[0]}`);
    const { format } = getFormat(query, columnTypes, f);
    encoding.y = {
      sort: generateSort(f),
      field: f.id,
      timeUnit: getTimeUnit(f, columnTypes, fieldTypeById),
      type: fieldTypeById[f.id],
      axis: isThumbnail
        ? null
        : {
            labels: true,
            title: config.axisTitle.yTitle || genTitle(f, query),
            format
          }
    };
    if (f.resolution && f.resolution === 'secondary') {
      axis.bottom = false;
    }
  }

  if (color) {
    switch (color.type) {
      case 'single':
        encoding.color = { value: color.color };
        break;
      case 'field': {
        const f = fieldMap[color.fieldId];
        invariant(f, `Missing field: ${color.fieldId}`);
        const typ = fieldTypeById[f.id];
        const { format } = getFormat(query, columnTypes, f);
        encoding.color = {
          field: f.id,
          type: typ === 'ordinal' ? 'nominal' : typ,
          legend:
            isThumbnail || config.legend.hasLegend === false
              ? null
              : {
                  title: genTitle(f, query),
                  format
                }
        };
        break;
      }
      default:
        throw new Error(`NYI - color type: ${color.type}`);
    }
  }

  if (size) {
    const f = fieldMap[size.fieldId];
    invariant(f, `Missing field: ${size.fieldId}`);
    const { format } = getFormat(query, columnTypes, f);
    encoding.size = {
      field: f.id,
      type: fieldTypeById[f.id],
      legend:
        isThumbnail || config.legend.hasLegend === false
          ? null
          : {
              labels: true,
              title: genTitle(f, query),
              format
            }
    };
  }

  // empty layer
  if (Object.keys(encoding).length === 0) return;

  let vgLayer = { mark, encoding, selection: undefined };
  if (isThumbnail) return { encoding: vgLayer, axis };

  // Line charts are compiled to a single mark in vega so tooltips don't work (they have a single value)
  // So we layer an invisible set of points on top to get tooltips
  if (mark === 'line') {
    vgLayer = {
      layer: [
        vgLayer,
        {
          mark: 'point',
          encoding: {
            ...encoding,
            color: { value: 'transparent' }
          }
        }
      ]
    };
  }
  return { encoding: vgLayer, axis };
}

function encodeConfig(c: ChartConfig) {
  const config = {
    legend: {
      orient: c.legend.orient,
      titleFontSize:
        c.legend.titleFontSize !== undefined
          ? parseInt(c.legend.titleFontSize, 10)
          : undefined,
      labelFontSize:
        c.legend.labelFontSize !== undefined
          ? parseInt(c.legend.labelFontSize, 10)
          : undefined
    },
    axis: {
      titleFontSize:
        c.axisTitle.fontSize !== undefined
          ? parseInt(c.axisTitle.fontSize, 10)
          : undefined
    },
    axisX: {
      labelFontSize:
        c.axisX.fontSize !== undefined
          ? parseInt(c.axisX.fontSize, 10)
          : undefined,
      labelAngle:
        c.axisY.labelAngle !== undefined
          ? parseInt(c.axisX.labelAngle, 10)
          : undefined
    },
    axisY: {
      labelFontSize:
        c.axisY.fontSize !== undefined
          ? parseInt(c.axisY.fontSize, 10)
          : undefined,
      labelAngle:
        c.axisY.labelAngle !== undefined
          ? parseInt(c.axisY.labelAngle, 10)
          : undefined
    },
    title: {
      fontSize:
        c.title.fontSize !== undefined
          ? parseInt(c.title.fontSize, 10)
          : undefined
    },
    padding: 5,
    view: {
      stroke: 'none'
    }
  };

  // hasBorder is default false
  if (!c.misc.hasBorder) {
    config.view.stroke = 'transparent';
  }

  return config;
}

export function encodeSpec(
  ir: ChartIR,
  query: Query,
  chartConfig: ChartConfig,
  columnTypes: ColumnTypes,
  isThumbnail: boolean
): VegaSpec {
  const config = encodeConfig(chartConfig);

  // group the layers by their axis
  const leftBot = [];
  const leftTop = [];
  const rtBot = [];
  const rtTop = [];

  for (const layerId of ir.layers) {
    const e = encodeLayer(
      ir,
      chartConfig,
      layerId,
      query,
      columnTypes,
      isThumbnail
    );

    if (e) {
      const { axis: { left, bottom }, encoding } = e;
      if (bottom) {
        if (left) leftBot.push(encoding);
        else rtBot.push(encoding);
      } else if (left) {
        leftTop.push(encoding);
      } else {
        rtTop.push(encoding);
      }
    }
  }

  let layer;
  let resolve;
  if (leftTop.length === 0 && rtBot.length === 0 && rtTop.length === 0) {
    // only the default axis is used
    // just render as a top-level layer[] to keep the vega-encoding simpler
    layer = leftBot;
  } else {
    // Group the layers by their axis types
    layer = [
      {
        layer: [
          {
            layer: leftBot
          },
          {
            layer: leftTop
          }
        ],
        resolve: { scale: { y: 'independent' } }
      },
      {
        layer: [
          {
            layer: rtBot
          },
          {
            layer: rtTop
          }
        ],
        resolve: { scale: { y: 'independent' } }
      }
    ];
    resolve = { scale: { x: 'independent' } };
  }

  return {
    config,
    layer,
    title: chartConfig.title.hasTitle !== false ? chartConfig.title.text : null,
    resolve
  };
}



// WEBPACK FOOTER //
// ./src/utils/chart/vega.js