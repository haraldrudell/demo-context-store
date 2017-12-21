// @flow
import invariant from 'invariant';
import { cloneDeep } from 'lodash';

import type { Id, ColumnTypes } from 'types';

import Chart, { type FieldDef, type LayerDef } from './Chart';

export type ClassifiedType = 'ordinal' | 'quantitative' | 'temporal';
export type ClassifiedFields = { [Id]: ClassifiedType };

export type ChartIR = {
  fieldMap: { [Id]: FieldDef },
  layerMap: { [Id]: LayerDef },

  layers: Array<Id>,
  fieldTypeById: ClassifiedFields
};

// Our auto-mark rules are just table-driven (for now)
const MARK_TABLE: Object = {
  ordinal: {
    mark: 'bar',
    ordinal: {
      mark: 'point'
    },
    quantitative: {
      mark: 'bar'
    },
    temporal: {
      mark: 'point'
    }
  },
  quantitative: {
    mark: 'point',
    quantitative: {
      mark: 'point'
    },
    ordinal: {
      mark: 'bar'
    },
    temporal: {
      mark: 'line'
    }
  },
  temporal: {
    mark: 'line',
    quantitative: {
      mark: 'line'
    },
    ordinal: {
      mark: 'point'
    },
    temporal: {
      mark: 'point'
    }
  }
};

// Use a canonical field-id for the auto-inserted count columns
// so that we don't do unnecessary re-evaluation on id changes
const AUTO_COUNT_ID = 'AUTO_COUNT_ID';

function deriveMark({ x, y, size }: LayerDef, fieldTypeById: ClassifiedFields) {
  // derive the mark type from the innermost axis fields
  let m;

  // If a temporal or quantitative field is used for size, then choose point
  if (size) {
    const typ = fieldTypeById[size.fieldId];
    if (typ === 'quantitative' || typ === 'temporal') {
      return 'point';
    }
  }

  if (x && x.length > 0) {
    const lastX = x[x.length - 1];
    const typ = fieldTypeById[lastX];
    m = MARK_TABLE[typ];
  }
  if (y && y.length > 0) {
    const lastY = y[y.length - 1];
    const typ = fieldTypeById[lastY];
    m = m ? m[typ] : MARK_TABLE[typ];
  }

  return (m && m.mark) || 'point';
}

function addCountField(id: Id, ir: ChartIR): Id {
  const { fieldTypeById } = ir;
  ir.fieldMap[id] = { type: 'count', id };
  fieldTypeById[id] = 'quantitative';
  return id;
}

function lowerLayer(ir: ChartIR, layerId: Id) {
  const { fieldTypeById } = ir;
  const layer = ir.layerMap[layerId];
  invariant(layer, `Missing Layer: ${layerId}`);

  const { x = [], y = [] } = layer;

  // If only 1 axis is used, default the other to count()
  if (x.length === 0 && y.length > 0) {
    layer.x = [addCountField(AUTO_COUNT_ID, ir)];
  } else if (y.length === 0 && x.length > 0) {
    layer.y = [addCountField(AUTO_COUNT_ID, ir)];
  }

  // If a mark isn't set then derive one
  if (!layer.mark) {
    layer.mark = deriveMark(layer, fieldTypeById);
  }
}

function classifyField(
  ret: ClassifiedFields,
  fieldMap: { [Id]: FieldDef },
  fieldId: Id,
  columnTypes: ColumnTypes
) {
  const f = fieldMap[fieldId];
  invariant(f, `Missing field: ${fieldId}`);
  let typ;
  if (f.type === 'count') {
    typ = 'quantitative';
  } else if (f.type === 'field') {
    // XXX:  Should at least use the agg function (eg binning)
    const colTyp = columnTypes[f.columnId] || 'text';
    switch (colTyp) {
      case 'number':
        typ =
          f.classification === 'discrete' && !f.func
            ? 'ordinal'
            : 'quantitative';
        break;
      case 'datetime':
        typ =
          f.classification === 'discrete' && !f.func ? 'ordinal' : 'temporal';
        break;
      default:
        typ = 'ordinal';
    }
    if (f.sort && f.sort.fieldId) {
      classifyField(ret, fieldMap, f.sort.fieldId, columnTypes);
    }
  }
  if (!typ) throw new Error(`Unexpected field type: ${f.type}`);

  ret[f.id] = typ;
}

function classifyFields(c: Chart, columnTypes: ColumnTypes): ClassifiedFields {
  const ret = {};
  const { layers, layerMap, fieldMap } = c;

  for (const layerId of layers) {
    const layer = layerMap[layerId];
    invariant(layer, `Missing layer: ${layerId}`);
    const { x = [], y = [], detail = [], color, size } = layer;
    x.forEach(id => classifyField(ret, fieldMap, id, columnTypes));
    y.forEach(id => classifyField(ret, fieldMap, id, columnTypes));
    detail.forEach(id => classifyField(ret, fieldMap, id, columnTypes));

    if (color && color.type === 'field') {
      classifyField(ret, fieldMap, color.fieldId, columnTypes);
    }
    if (size) {
      classifyField(ret, fieldMap, size.fieldId, columnTypes);
    }
  }

  return ret;
}

// Transforms the Chart to an intermediate representation
// If a mark wasn't chosen, we deduce one here
// If a single axis is used, we insert count on the other
export function toIR(c: Chart, columnTypes: ColumnTypes): ChartIR {
  const { layers, layerMap, fieldMap } = c;
  const fieldTypeById = classifyFields(c, columnTypes);

  // XXX: cloneDeep is a little heavy-handed, but it's simple and these objects are small
  const ir = cloneDeep({ layers, layerMap, fieldMap, fieldTypeById });

  for (const layerId of layers) {
    lowerLayer(ir, layerId);
  }
  return ir;
}



// WEBPACK FOOTER //
// ./src/utils/chart/ir.js