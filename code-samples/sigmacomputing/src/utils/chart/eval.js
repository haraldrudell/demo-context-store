// @flow
import invariant from 'invariant';
import type { Id } from '@sigmacomputing/sling';

import { type ChartIR } from './ir';
import type { AggDef } from './Chart';

type ChartFieldSort =
  | {| type: 'natural', isAsc: boolean |}
  | {| type: 'sortBy', isAsc: boolean, columnId: Id |};

type ChartField =
  | {| type: 'dimension', columnId: Id |}
  | {| type: 'measure', columnId: ?Id, aggregate: AggDef |};

type ChartFieldType = {
  field: ChartField,
  sort?: ChartFieldSort
};

type Axis = {
  fields: Array<Id>
};

export type ChartEvalDef = {
  axes: Array<Axis>,
  columns: { [Id]: ChartFieldType }
};

function buildColumns(ir: ChartIR) {
  const { fieldMap, fieldTypeById } = ir;
  const columns = {};

  for (const id of Object.keys(fieldMap)) {
    const fieldDef = fieldMap[id];
    const classifiedType = fieldTypeById[id];
    let field;
    if (fieldDef.type === 'field') {
      if (classifiedType === 'quantitative' && fieldDef.func) {
        field = {
          type: 'measure',
          columnId: fieldDef.columnId,
          aggregate: fieldDef.func
        };
      } else {
        const binning = fieldDef.bin
          ? {
              binning: {
                type: 'temporal',
                bin: fieldDef.bin
              }
            }
          : null;
        field = {
          type: 'dimension',
          columnId: fieldDef.columnId,
          ...binning
        };
      }
    } else {
      field = { type: 'measure', aggregate: 'count' };
    }

    let sort;

    if (classifiedType === 'ordinal') {
      // discrete columns always have a sort (explicit or default)
      if (fieldDef.sort) {
        const { isAsc, fieldId } = fieldDef.sort;
        // user-specified sort
        if (fieldId) {
          sort = { type: 'sortBy', isAsc, columnId: fieldId };
        } else {
          sort = { type: 'natural', isAsc };
        }
      } else {
        sort = { type: 'natural', isAsc: true };
      }
    }

    columns[id] = { field, sort };
  }

  return columns;
}

function cmpAxis(a: Axis, b: Axis) {
  const af = a.fields.join();
  const bf = b.fields.join();
  if (af < bf) return -1;
  else if (af > bf) return 1;
  return 0;
}

export function serializeForEval(ir: ChartIR): Array<ChartEvalDef> {
  const { layers, layerMap } = ir;
  const ret = [];

  for (const layerId of layers) {
    const layer = layerMap[layerId];
    invariant(layer, `Missing Layer: ${layerId}`);
    const { x = [], y = [], detail = [], color, size } = layer;

    // Build the axes
    const axes = [];

    if (x.length > 0) axes.push({ fields: x });
    if (y.length > 0) axes.push({ fields: y });
    if (detail.length > 0) axes.push({ fields: detail });

    if (color && color.type === 'field') {
      axes.push({ fields: [color.fieldId] });
    }
    if (size) {
      axes.push({ fields: [size.fieldId] });
    }

    const columns = buildColumns(ir);

    // return axes in canonical ordering
    axes.sort(cmpAxis);

    // don't fetch empty layers
    if (axes.length > 0) {
      ret.push({ axes, columns });
    }
  }
  return ret;
}



// WEBPACK FOOTER //
// ./src/utils/chart/eval.js