// @flow
import React, { Component } from 'react';
import type { ValueType, ColumnId } from '@sigmacomputing/sling';
import invariant from 'invariant';

import type { Id } from 'types';
import type {
  FieldDef,
  BinDef,
  ClassificationDef,
  FuncDef,
  ChannelDef,
  ResolutionDef
} from 'utils/chart/Chart';
import type { SortInfo, SortFields } from './OptionsModal';
import { Box } from 'widgets';
import FieldDropzone from './Dropzone';

export default class ChartDropzone extends Component<{
  allowMultiple: boolean,
  hasMultLayers: boolean,
  fields: SortFields,
  channel: ChannelDef,
  labels: { [string]: string },
  onUpdate: (channel: ChannelDef, columnId: ?ColumnId) => void,
  onUpdateFunc: (fieldId: Id, func?: FuncDef) => void,
  onUpdateBin: (fieldId: Id, bin?: BinDef) => void,
  onUpdateClassification: (
    fieldId: Id,
    classification?: ClassificationDef
  ) => void,
  onUpdateSort: (fieldId: Id, sort: SortInfo) => void,
  onUpdateResolution: (fieldId: Id, resolution: ResolutionDef) => void,

  types: { [string]: ?ValueType },
  fieldMap: { [Id]: FieldDef },
  value: ?Id | Array<Id>
}> {
  static defaultProps = {
    allowMultiple: false,
    onUpdate: (() => {}: (ChannelDef, ?ColumnId) => void),
    onUpdateFunc: (() => {}: (fieldId: Id, func?: FuncDef) => void),
    onUpdateBin: (() => {}: (fieldId: Id, bin?: BinDef) => void),
    onUpdateClassification: (() => {}: (
      fieldId: Id,
      classification?: ClassificationDef
    ) => void),
    onUpdateResolution: (() => {}: (
      fieldId: Id,
      resolution: ResolutionDef
    ) => void)
  };

  getFieldId = (index: number) => {
    const { value } = this.props;
    invariant(value, `Missing value`);
    return value instanceof Array ? value[index] : value;
  };
  setColumn = (index: number, columnId: ?ColumnId) => {
    invariant(index === 0, `NYI Multi-column Axis: ${index}`);
    const { channel, onUpdate } = this.props;
    onUpdate(channel, columnId);
  };

  onUpdateFunc = (index: number, func?: FuncDef) => {
    const { onUpdateFunc } = this.props;
    onUpdateFunc(this.getFieldId(index), func);
  };

  onUpdateBin = (index: number, bin?: BinDef) => {
    const { onUpdateBin } = this.props;
    onUpdateBin(this.getFieldId(index), bin);
  };

  onUpdateClassification = (
    index: number,
    classification?: ClassificationDef
  ) => {
    const { onUpdateClassification } = this.props;
    onUpdateClassification(this.getFieldId(index), classification);
  };

  onUpdateSort = (index: number, sort: SortInfo) => {
    const { onUpdateSort } = this.props;
    onUpdateSort(this.getFieldId(index), sort);
  };

  onUpdateResolution = (index: number, resolution: ResolutionDef) => {
    const { onUpdateResolution } = this.props;
    onUpdateResolution(this.getFieldId(index), resolution);
  };

  renderValue() {
    const {
      labels,
      types,
      value,
      fields,
      fieldMap,
      hasMultLayers,
      channel
    } = this.props;

    let resolutionType;

    // If there are multiple layers then allow axis / legend resolution
    if (hasMultLayers) {
      switch (channel) {
        case 'x':
          resolutionType = 'AxisX';
          break;
        case 'y':
          resolutionType = 'AxisY';
          break;
        case 'color':
        case 'size':
        case 'detail':
          // no resolution for color, size, detail
          break;
        default:
          throw new Error(`Unexpected channel: ${channel}`);
      }
    }

    if (value instanceof Array) {
      return value.map((id, i) => {
        const v = fieldMap[id];
        invariant(v, `Missing field: ${id}`);
        if (v.type === 'field') {
          return (
            <FieldDropzone
              key={v.id}
              id={v.columnId}
              type={types[v.columnId] || 'text'}
              label={labels[v.columnId]}
              fields={fields}
              fieldMap={fieldMap}
              func={v.func}
              bin={v.bin}
              classification={v.classification}
              sort={v.sort}
              index={i}
              setColumn={this.setColumn}
              onUpdateFunc={this.onUpdateFunc}
              onUpdateBin={this.onUpdateBin}
              onUpdateClassification={this.onUpdateClassification}
              onUpdateSort={this.onUpdateSort}
              onUpdateResolution={this.onUpdateResolution}
              resolutionType={resolutionType}
              resolution={v.resolution}
            />
          );
        } else if (v.type === 'count') {
          /* TODO: Count Drops aren't enabled yet
          return (
            <FieldDropzone
              key={v.id}
              id={COUNT_COLUMN}
              label="COUNT"
              index={i}
              setColumn={this.setColumn}
              onUpdateFunc={this.onUpdateFunc}
              onUpdateSort={this.onUpdateSort}
            />
          );
          */
        }
        return null;
      });
    } else if (value) {
      const v = fieldMap[value];
      invariant(v, `Missing field: ${value}`);

      if (v.type === 'field') {
        return (
          <FieldDropzone
            type={types[v.columnId] || 'text'}
            id={v.columnId}
            label={labels[v.columnId]}
            fields={fields}
            fieldMap={fieldMap}
            func={v.func}
            bin={v.bin}
            classification={v.classification}
            sort={v.sort}
            index={0}
            setColumn={this.setColumn}
            onUpdateFunc={this.onUpdateFunc}
            onUpdateBin={this.onUpdateBin}
            onUpdateClassification={this.onUpdateClassification}
            onUpdateSort={this.onUpdateSort}
            onUpdateResolution={this.onUpdateResolution}
            resolutionType={resolutionType}
            resolution={v.resolution}
          />
        );
      } else if (v.type === 'count') {
        /* TODO: Count Drops aren't enabled yet
      return (
        <FieldDropzone
          key={value.id}
          id={COUNT_COLUMN}
          label="COUNT"
          index={0}
          setColumn={this.setColumn}
          onUpdateFunc={this.onUpdateFunc}
          onUpdateSort={this.onUpdateSort}
        />
        );*/
      }
    }
    return null;
  }

  renderPlaceholder() {
    const { allowMultiple, value, fieldMap } = this.props;

    if (!value)
      return (
        <FieldDropzone
          index={0}
          fieldMap={fieldMap}
          setColumn={this.setColumn}
          onUpdateFunc={this.onUpdateFunc}
          onUpdateBin={this.onUpdateBin}
          onUpdateClassification={this.onUpdateClassification}
          onUpdateSort={this.onUpdateSort}
          onUpdateResolution={this.onUpdateResolution}
        />
      );
    if (value instanceof Array && (value.length === 0 || allowMultiple))
      return (
        <FieldDropzone
          index={value.length}
          fieldMap={fieldMap}
          setColumn={this.setColumn}
          onUpdateFunc={this.onUpdateFunc}
          onUpdateClassification={this.onUpdateClassification}
          onUpdateBin={this.onUpdateBin}
          onUpdateSort={this.onUpdateSort}
          onUpdateResolution={this.onUpdateResolution}
        />
      );
    return null;
  }

  render() {
    return (
      <Box b={1} borderRadius="2px" borderColor="darkBlue4">
        {this.renderValue()}
        {this.renderPlaceholder()}
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ChartInspector/format/ChartDropzone.js