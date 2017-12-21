// @flow
import type { Id, ColumnId } from '@sigmacomputing/sling';
import invariant from 'invariant';

import Chart from './Chart';
import ChartConfig from './ChartConfig';
// Encodes a Chart object to be stored in persistent storage

// Decodes a Chart object from persistent storage / upgrades it

const CURRENT_VERSION = 4;

// Types from the Version 1 serialized format
type V1_ChartAgg = 'min' | 'avg' | 'sum' | 'max' | 'median';
type V1_ChartTimeBin = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

type V1_ChartNumBin = 'bin';

type V1_ChartFunc = V1_ChartAgg | V1_ChartTimeBin | V1_ChartNumBin;

type V1_ChartSortKeyType =
  | {| type: 'natural' |}
  | {| type: 'count', id: Id |}
  | {|
      type: 'field',
      id: Id,
      columnId: ColumnId,
      func?: V1_ChartFunc
    |};

type V1_ChartSortType = {
  key: V1_ChartSortKeyType,
  isAsc: boolean
};

type V1_ChartFieldType =
  | {| type: 'count', id: Id, sort?: V1_ChartSortType |}
  | {|
      type: 'field',
      id: Id,
      columnId: ColumnId,
      func?: V1_ChartFunc,
      sort?: V1_ChartSortType
    |};

function addField(chart: Chart, f: V1_ChartFieldType): Id {
  // In V1, fields were stored as inline structs
  // we need to add them to the field Map

  if (f.type === 'field') {
    const id = chart.newColumnField(f.columnId);
    // bin never worked in v1 and isn't in v2
    const { func } = f;
    if (func && func !== 'bin') {
      switch (func) {
        case 'year':
        case 'month':
        case 'day':
        case 'hour':
        case 'minute':
        case 'second':
          chart.setFieldBin(id, func);
          break;
        default:
          chart.setFieldFunc(id, func);
          break;
      }
    }
    // sorting was never released in v1
    return id;
  }

  // count field
  return chart.newCountField();
}

function readVersion1(d: Object) {
  const { id, title, x, y, mark, color, size } = d;

  const chart = new Chart(id);

  // Version 1 didn't have layers so everything is on base
  const layerId = chart.layers[0];

  if (mark) chart.setMark(layerId, mark);

  // x and y axis were stored as arrays but never > 1
  if (x.length === 1) {
    chart.setChannelField(layerId, 'x', addField(chart, x[0]));
  }

  if (y.length === 1) {
    chart.setChannelField(layerId, 'y', addField(chart, y[0]));
  }

  if (color) {
    if (color.type === 'field') {
      chart.setChannelField(layerId, 'color', addField(chart, color.field));
    } else {
      chart.setSingleColor(layerId, color.color);
    }
  }

  if (size) {
    chart.setChannelField(layerId, 'size', addField(chart, size));
  }

  if (title) {
    const config = new ChartConfig();
    config.setTitle(title);
    chart.setConfig(config);
  }

  return chart;
}

// we used to treat time units as functions
function upgradeTimeBins(fieldMap = {}) {
  for (const id of Object.keys(fieldMap)) {
    const f = fieldMap[id];
    const { func } = f;
    if (func && func !== 'bin') {
      switch (func) {
        case 'year':
        case 'month':
        case 'day':
        case 'hour':
        case 'minute':
        case 'second':
          delete f.func;
          f.bin = func;
          break;
        default:
          break;
      }
    }
  }
  return fieldMap;
}

export function readVersion2(d: Object) {
  const { id, meta, fieldMap, layerMap, layers, config } = d;
  const c = new Chart(id);
  c.fieldMap = upgradeTimeBins(fieldMap);
  c.layerMap = layerMap;
  c.layers = layers;

  const chartConfig = new ChartConfig();
  if (config) {
    const { title, axisTitle, axisX, axisY, legend, misc } = config;
    if (title) chartConfig.updateTitleConfig(title);
    if (axisTitle) chartConfig.updateAxisTitle(axisTitle);
    if (axisX) chartConfig.updateAxis('x', axisX);
    if (axisY) chartConfig.updateAxis('y', axisY);
    if (legend) chartConfig.updateLegend(legend);
    if (misc) chartConfig.updateMisc(misc);
  }

  if (meta && meta.title) {
    chartConfig.setTitle(meta.title);
  }

  if (config || (meta && meta.title)) {
    c.setConfig(chartConfig);
  }

  return c;
}

export function decodeChart(s: string): Chart {
  const d = JSON.parse(s);

  if (!d.version) {
    // Version 1 Upgrade (version was not set)
    return readVersion1(d);
  }

  if (d.version === 2) {
    return readVersion2(d);
  }

  invariant(
    d.version === CURRENT_VERSION || (CURRENT_VERSION === 4 && d.version === 3),
    `Unexpected Version ${d.version} ${CURRENT_VERSION}`
  );

  const { id, fieldMap, layerMap, layers, config } = d;
  const c = new Chart(id);
  // The only difference between 3 and 4 is time became bins not aggregates
  c.fieldMap = d.version === 3 ? upgradeTimeBins(fieldMap) : fieldMap;
  c.layerMap = layerMap;
  c.layers = layers;
  if (config) {
    const chartConfig = new ChartConfig();
    chartConfig.updateTitleConfig(config.title);
    if (config.axisTitle) {
      chartConfig.updateAxisTitle(config.axisTitle);
    }
    if (config.axisX) {
      chartConfig.updateAxis('x', config.axisX);
    }
    if (config.axisY) {
      chartConfig.updateAxis('y', config.axisY);
    }
    if (config.legend) {
      chartConfig.updateLegend(config.legend);
    }
    if (config.tooltip) {
      chartConfig.updateTooltip(config.tooltip);
    }
    if (config.misc) {
      chartConfig.updateMisc(config.misc);
    }
    c.setConfig(chartConfig);
  }
  return c;
}

export function serializeForStorage(c: Chart): string {
  const { id, fieldMap, layerMap, layers, config } = c;

  const ser = {
    version: CURRENT_VERSION,
    id,
    fieldMap,
    layerMap,
    layers,
    config: {
      title: config.title,
      legend: config.legend,
      misc: config.misc,
      axisTitle: config.axisTitle,
      axisX: config.axisX,
      axisY: config.axisY
    }
  };
  return JSON.stringify(ser);
}



// WEBPACK FOOTER //
// ./src/utils/chart/storage.js