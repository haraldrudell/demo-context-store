// @flow
import type { Id, ColumnId, ValueType } from '@sigmacomputing/sling';
import invariant from 'invariant';

import ChartConfig from './ChartConfig';
import genId from 'utils/uuid62';

// For x-axis: primary is left, secondary is right
// For y-axis: primary is bottom, secondary is top
export type ResolutionDef = 'primary' | 'secondary';

export type AggDef = 'min' | 'avg' | 'sum' | 'max' | 'median';

export type TimeBinDef =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second';

export type FuncDef = AggDef;
export type BinDef = TimeBinDef;

export type SortDef = {
  fieldId: ?Id, // set if we're sorting by another field
  isAsc: boolean
};

export type ClassificationDef = 'continuous' | 'discrete';

export type FieldDef =
  | {| type: 'count', id: Id, sort?: SortDef, resolution?: ResolutionDef |}
  | {|
      type: 'field',
      id: Id,
      columnId: ColumnId,
      func?: FuncDef,
      bin?: BinDef,
      sort?: SortDef,
      classification?: ClassificationDef,
      resolution?: ResolutionDef
    |};

export type ColorDef =
  | {| type: 'single', color: string |}
  | {| type: 'field', fieldId: Id |};

export type SizeDef = {| type: 'field', fieldId: Id |};

export type MarkDef = 'bar' | 'line' | 'point' | 'area';
export type ChannelDef = 'x' | 'y' | 'color' | 'size' | 'detail';

export type LayerDef = {
  id: Id,

  mark?: ?MarkDef,

  // encoding channels
  x?: Array<Id>,
  y?: Array<Id>,

  color?: ColorDef,
  size?: SizeDef,
  detail?: Array<Id>
};

export default class Chart {
  // Chart Identifier
  id: Id;

  config: ChartConfig;

  fieldMap: { [Id]: FieldDef };
  layerMap: { [Id]: LayerDef };

  layers: Array<Id>;

  // TODO: Add facets
  // facet: ?FacetDef,

  constructor(id: Id = genId()) {
    this.id = id;
    this.fieldMap = {};
    this.layerMap = {};
    this.layers = [];
    this.config = new ChartConfig();

    // add the base layer
    this.addLayer();
  }

  addLayer(): Id {
    const id = genId();
    const { layerMap, layers } = this;
    layerMap[id] = { id, mark: null };
    layers.push(id);
    return id;
  }

  cloneField(srcId: Id): Id {
    const srcField = this.fieldMap[srcId];
    invariant(srcField, `Missing Field: ${srcId}`);

    switch (srcField.type) {
      case 'count': {
        const newFieldId = this.newCountField();
        const newField = this.fieldMap[newFieldId];
        if (srcField.resolution) {
          newField.resolution = srcField.resolution;
        }
        if (srcField.sort) {
          const { isAsc, fieldId } = srcField.sort;
          newField.sort = {
            isAsc,
            fieldId: fieldId && this.cloneField(fieldId)
          };
        }
        return newFieldId;
      }
      case 'field': {
        const { columnId, func, sort, resolution } = srcField;
        const newFieldId = this.newColumnField(columnId);
        const newField = this.fieldMap[newFieldId];
        invariant(
          newField.type === 'field',
          `Should be field: ${newField.type}`
        );
        if (func) newField.func = func;
        if (resolution) newField.resolution = resolution;
        if (sort) {
          const { isAsc, fieldId } = sort;
          newField.sort = {
            isAsc,
            fieldId: fieldId && this.cloneField(fieldId)
          };
        }
        return newFieldId;
      }
      default:
        throw new Error(`Unexpected type: ${srcField.type}`);
    }
  }

  // adds a new layer which is a clone of the arg
  cloneLayer(layerId: Id): Id {
    const srcLayer = this.layerMap[layerId];
    invariant(srcLayer, `Invalid layer: ${layerId} {this.layerMap}`);

    const newLayerId = this.addLayer();
    const newLayer = this.layerMap[newLayerId];
    invariant(newLayer, `Invalid layer: ${newLayerId} {this.layerMap}`);

    const { mark, x, y, color, size, detail } = srcLayer;
    if (mark) newLayer.mark = mark;

    if (x) newLayer.x = x.map(id => this.cloneField(id));
    if (y) newLayer.y = y.map(id => this.cloneField(id));
    if (detail) newLayer.detail = detail.map(id => this.cloneField(id));

    if (color) {
      switch (color.type) {
        case 'single':
          newLayer.color = { type: 'single', color: color.color };
          break;
        case 'field':
          newLayer.color = {
            type: 'field',
            fieldId: this.cloneField(color.fieldId)
          };
          break;
        default:
          throw new Error(`Unexpected ${color.type}`);
      }
    }
    if (size) {
      newLayer.size = {
        type: 'field',
        fieldId: this.cloneField(size.fieldId)
      };
    }
    return newLayerId;
  }

  deleteLayer(layerId: Id): ?LayerDef {
    const { layers, layerMap } = this;
    const was = layerMap[layerId];
    delete layerMap[layerId];
    this.layers = layers.filter(x => x !== layerId);
    return was;
  }

  setMark(layerId: Id, mark: ?MarkDef) {
    const layer = this.layerMap[layerId];
    invariant(layer, `Invalid layer: ${layerId} {this.layerMap}`);

    if (mark) {
      layer.mark = mark;
    } else {
      layer.mark = null;
    }
  }

  setConfig(config: ChartConfig) {
    this.config = config;
  }

  setSingleColor(layerId: Id, color: ?string) {
    const layer = this.layerMap[layerId];
    invariant(layer, `Invalid layer: ${layerId} {this.layerMap}`);

    if (color) {
      layer.color = { type: 'single', color };
    } else {
      delete layer.color;
    }
  }

  clearChannel(layerId: Id, channel: ChannelDef) {
    const layer = this.layerMap[layerId];
    invariant(layer, `Invalid layer: ${layerId} {this.layerMap}`);
    delete layer[channel];
  }

  swapAxis(layerId: Id) {
    const layer = this.layerMap[layerId];
    invariant(layer, `Invalid layer: ${layerId} {this.layerMap}`);
    const t = layer.x;
    layer.x = layer.y;
    layer.y = t;
  }

  setChannelField(layerId: Id, channel: ChannelDef, fieldId: Id) {
    const layer = this.layerMap[layerId];
    invariant(layer, `Invalid layer: ${layerId} {this.layerMap}`);

    switch (channel) {
      case 'x':
      case 'y':
      case 'detail':
        layer[channel] = [fieldId];
        break;
      case 'color':
        layer.color = { type: 'field', fieldId };
        break;
      case 'size':
        layer.size = { type: 'field', fieldId };
        break;
      default:
        throw new Error(`Unexpected channel: ${channel}`);
    }
  }

  setFieldFunc(fieldId: Id, func?: FuncDef) {
    const { fieldMap } = this;
    const f = fieldMap[fieldId];
    invariant(f, `Missing field: ${fieldId}`);
    invariant(f.type === 'field', `Cannot set func on count field: ${f.type}`);
    f.func = func;
  }

  setFieldBin(fieldId: Id, bin?: BinDef) {
    const { fieldMap } = this;
    const f = fieldMap[fieldId];
    invariant(f, `Missing field: ${fieldId}`);
    invariant(f.type === 'field', `Cannot set bin on count field: ${f.type}`);
    f.bin = bin;
  }

  setFieldClassification(fieldId: Id, classification?: ClassificationDef) {
    const { fieldMap } = this;
    const f = fieldMap[fieldId];
    invariant(f, `Missing field: ${fieldId}`);
    invariant(
      f.type === 'field',
      `Cannot set classification on count field: ${f.type}`
    );
    f.classification = classification;
  }

  setFieldResolution(fieldId: Id, resolution?: ResolutionDef) {
    const { fieldMap } = this;
    const f = fieldMap[fieldId];
    invariant(f, `Missing field: ${fieldId}`);
    if (resolution) {
      f.resolution = resolution;
    } else {
      delete f.resolution;
    }
  }

  newCountField(): Id {
    const { fieldMap } = this;
    const id = genId();
    fieldMap[id] = { type: 'count', id };
    return id;
  }

  newColumnField(columnId: Id, typ: ?ValueType): Id {
    const { fieldMap } = this;
    const id = genId();
    // for numeric columns, automatically apply an aggregate
    const f = {
      type: 'field',
      id,
      columnId,
      func: typ === 'number' ? 'sum' : undefined
    };
    fieldMap[id] = f;
    return id;
  }

  _hasField(ch: ?Array<Id>, fieldId: Id) {
    return ch && ch.includes(fieldId);
  }

  isFieldReferenced(fieldId: Id): boolean {
    for (const layerId of this.layers) {
      const { x, y, detail, color, size } = this.layerMap[layerId];
      if (
        this._hasField(x, fieldId) ||
        this._hasField(y, fieldId) ||
        this._hasField(detail, fieldId) ||
        (color && color.type === 'field' && color.fieldId === fieldId) ||
        (size && size.type === 'field' && size.fieldId === fieldId)
      ) {
        return true;
      }

      // sorted by this field
      if (x) {
        for (let i = 0; i < x.length; i++) {
          const xField = this.fieldMap[x[i]];
          if (xField.sort && xField.sort.fieldId === fieldId) return true;
        }
      }

      if (y) {
        for (let i = 0; i < y.length; i++) {
          const yField = this.fieldMap[y[i]];
          if (yField.sort && yField.sort.fieldId === fieldId) return true;
        }
      }
    }

    return false;
  }

  deleteField(fieldId: Id) {
    const f = this.fieldMap[fieldId];
    invariant(f, `No such field: ${fieldId}`);

    invariant(
      !this.isFieldReferenced(fieldId),
      `BUG: deleting referenced field: ${fieldId}`
    );
    delete this.fieldMap[fieldId];
  }

  clearFieldSort(fieldId: Id) {
    const f = this.fieldMap[fieldId];
    invariant(f, `Missing Field: ${fieldId}`);
    delete f.sort;
  }

  setSort(fieldId: Id, isAsc: boolean, sortByFieldId: ?Id) {
    const f = this.fieldMap[fieldId];
    invariant(f, `Missing Field: ${fieldId}`);
    f.sort = { fieldId: sortByFieldId, isAsc };
  }

  isEmpty() {
    const { layers, layerMap } = this;
    for (const layerId of layers) {
      const layer = layerMap[layerId];
      invariant(layer, `Bad layer: ${layerId}`);
      const { x = [], y = [], size = [], color = [], detail = [] } = layer;
      if (x.length > 0 || y.length > 0 || detail.length > 0) return false;
      if (size && size.type === 'field') return false;
      if (color && color.type === 'field') return false;
    }
    return true;
  }
}



// WEBPACK FOOTER //
// ./src/utils/chart/Chart.js