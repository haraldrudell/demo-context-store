// @flow
import React, { PureComponent } from 'react';
import type { ValueType, ColumnId, Column, Id } from '@sigmacomputing/sling';
import { cloneDeep } from 'lodash';

import Chart from 'utils/chart/Chart';
import type {
  FuncDef,
  BinDef,
  ClassificationDef,
  MarkDef,
  ChannelDef,
  ResolutionDef
} from 'utils/chart/Chart';
import type { SortInfo } from './OptionsModal';
import { Box, Flex, IconButton, ComboBox, Menu } from 'widgets';
import ChartDropzone from './ChartDropzone';
import SingleColorPicker from './SingleColorPicker';

const Title = ({ title, children }: { title: string, children?: any }) => (
  <Flex align="center" font="header5" justify="space-between" mb={1}>
    {title}
    {children}
  </Flex>
);

const { MenuItem } = Menu;

export default class ChartFormat extends PureComponent<{
  labels: { [string]: string },
  columns: { [ColumnId]: Column },
  types: { [string]: ?ValueType },
  setChart: Chart => void,
  chart: Chart,
  layerId: Id,
  setLayerId: Id => void
}> {
  onUpdate = (channel: ChannelDef, columnId: ?ColumnId) => {
    const { setChart, chart, types, layerId } = this.props;
    const newChart = cloneDeep(chart);

    if (columnId) {
      const fieldId = newChart.newColumnField(columnId, types[columnId]);
      newChart.setChannelField(layerId, channel, fieldId);
    } else {
      newChart.clearChannel(layerId, channel);
    }
    setChart(newChart);
  };

  onUpdateFunc = (fieldId: Id, func?: FuncDef) => {
    const { setChart, chart } = this.props;
    const newChart = cloneDeep(chart);

    newChart.setFieldFunc(fieldId, func);
    setChart(newChart);
  };

  onUpdateResolution = (fieldId: Id, resolution: ResolutionDef) => {
    const { setChart, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.setFieldResolution(fieldId, resolution);
    setChart(newChart);
  };

  onUpdateBin = (fieldId: Id, bin?: BinDef) => {
    const { setChart, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.setFieldBin(fieldId, bin);
    setChart(newChart);
  };

  onUpdateClassification = (
    fieldId: Id,
    classification?: ClassificationDef
  ) => {
    const { setChart, chart } = this.props;
    const newChart = cloneDeep(chart);
    newChart.setFieldClassification(fieldId, classification);
    setChart(newChart);
  };

  onUpdateSort = (fieldId: Id, sort: SortInfo) => {
    const { setChart, chart } = this.props;
    const { sortOrder, sortBy, field, func } = sort;
    const newChart = cloneDeep(chart);

    let sortByFieldId;
    if (sortBy === 'field') {
      sortByFieldId = newChart.newColumnField(field);
      if (func) newChart.setFieldFunc(sortByFieldId, func);
    }
    newChart.setSort(fieldId, sortOrder, sortByFieldId);
    setChart(newChart);
  };

  onSwapAxis = () => {
    const { setChart, chart, layerId } = this.props;
    const newChart = cloneDeep(chart);
    newChart.swapAxis(layerId);
    setChart(newChart);
  };

  onSelectMark = (mark: MarkDef | 'auto') => {
    const { setChart, chart, layerId } = this.props;
    const newChart = cloneDeep(chart);
    if (mark === 'auto') {
      newChart.setMark(layerId, null);
    } else {
      newChart.setMark(layerId, mark);
    }
    setChart(newChart);
  };

  onSetSingleColor = (color: string) => {
    const { setChart, chart, layerId } = this.props;
    const newChart = cloneDeep(chart);

    newChart.setSingleColor(layerId, color);
    setChart(newChart);
  };

  onAddLayer = () => {
    const { chart, setChart, setLayerId, layerId } = this.props;
    const newChart = cloneDeep(chart);
    const newLayerId = newChart.cloneLayer(layerId);
    setChart(newChart);
    setLayerId(newLayerId);
  };

  onDeleteLayer = () => {
    const { chart, layerId, setChart, setLayerId } = this.props;
    const newChart = cloneDeep(chart);
    const idx = Math.max(newChart.layers.findIndex(x => x === layerId) - 1, 0);
    const nextLayerId = newChart.layers[idx];
    newChart.deleteLayer(layerId);
    setChart(newChart);
    setLayerId(nextLayerId);
  };

  getFields = () => {
    const { columns, labels, types } = this.props;
    // We only want to list Numeric Columns to Sort By
    return Object.keys(columns)
      .filter(columnId => types[columnId] === 'number')
      .map(columnId => {
        return {
          columnId,
          label: labels[columnId]
        };
      });
  };

  renderLayerSelector = () => {
    const { chart, layerId, setLayerId } = this.props;
    return (
      <ComboBox selected={layerId} setSelection={setLayerId} width="200px">
        {chart.layers.map((l, idx) => (
          <MenuItem id={l} key={l} name={idx === 0 ? 'Base' : `Layer ${idx}`} />
        ))}
      </ComboBox>
    );
  };

  render() {
    const { chart, types, labels, layerId } = this.props;
    const fields = this.getFields();

    const { fieldMap, layers } = chart;
    const layer = chart.layerMap[layerId];

    const hasMultLayers = layers.length > 1;
    const isBaseLayer = chart.layers[0] === layerId;

    const { color, size } = layer;
    let colorFieldId, singleColor, sizeFieldId;
    if (color) {
      if (color.type === 'field') colorFieldId = color.fieldId;
      else singleColor = color.color;
    }

    if (size) {
      sizeFieldId = size.fieldId;
    }

    return (
      <Box p={3}>
        <Box>
          <Title title="Mark Type" />
          <ComboBox
            selected={layer.mark || 'auto'}
            setSelection={this.onSelectMark}
            width="75px"
          >
            <MenuItem id="auto" name="Auto" />
            <MenuItem id="bar" name="Bar" />
            <MenuItem id="line" name="Line" />
            <MenuItem id="point" name="Point" />
            <MenuItem id="area" name="Area" />
          </ComboBox>
        </Box>

        <Box mt={2}>
          <Title title="X Axis" />
          <ChartDropzone
            channel="x"
            labels={labels}
            fields={fields}
            onUpdate={this.onUpdate}
            onUpdateFunc={this.onUpdateFunc}
            onUpdateBin={this.onUpdateBin}
            onUpdateClassification={this.onUpdateClassification}
            onUpdateSort={this.onUpdateSort}
            onUpdateResolution={this.onUpdateResolution}
            types={types}
            fieldMap={fieldMap}
            value={layer.x}
            hasMultLayers={hasMultLayers}
          />
        </Box>

        <Box mt={2}>
          <Title title="Y Axis">
            <IconButton
              onClick={this.onSwapAxis}
              type="swap"
              color="darkBlue3"
            />
            {/* opacity: 0 to help center the swap */}
            <div css={`opacity: 0;`}>Y Axis</div>
          </Title>
          <ChartDropzone
            channel="y"
            fields={fields}
            labels={labels}
            onUpdate={this.onUpdate}
            onUpdateFunc={this.onUpdateFunc}
            onUpdateBin={this.onUpdateBin}
            onUpdateClassification={this.onUpdateClassification}
            onUpdateSort={this.onUpdateSort}
            onUpdateResolution={this.onUpdateResolution}
            types={types}
            fieldMap={fieldMap}
            value={layer.y}
            hasMultLayers={hasMultLayers}
          />
        </Box>

        <Box mt={2}>
          <Title title="Size" />
          <ChartDropzone
            channel="size"
            fields={fields}
            labels={labels}
            onUpdate={this.onUpdate}
            onUpdateFunc={this.onUpdateFunc}
            onUpdateBin={this.onUpdateBin}
            onUpdateClassification={this.onUpdateClassification}
            onUpdateSort={this.onUpdateSort}
            onUpdateResolution={this.onUpdateResolution}
            types={types}
            fieldMap={fieldMap}
            value={sizeFieldId}
            hasMultLayers={hasMultLayers}
          />
        </Box>

        <Box mt={2}>
          <Title title="Color">
            <SingleColorPicker
              disabled={colorFieldId != null}
              onSelect={this.onSetSingleColor}
              selected={singleColor}
            />
          </Title>
          <ChartDropzone
            channel="color"
            fields={fields}
            labels={labels}
            onUpdate={this.onUpdate}
            onUpdateFunc={this.onUpdateFunc}
            onUpdateBin={this.onUpdateBin}
            onUpdateClassification={this.onUpdateClassification}
            onUpdateSort={this.onUpdateSort}
            onUpdateResolution={this.onUpdateResolution}
            types={types}
            fieldMap={fieldMap}
            value={colorFieldId}
            hasMultLayers={hasMultLayers}
          />
        </Box>
        <Box mt={2}>
          <Flex align="center">
            <Title title="Layers" />
            <IconButton
              onClick={this.onAddLayer}
              mb={1}
              p={1}
              size="10px"
              type="plus"
            />
            {hasMultLayers && (
              <IconButton
                disabled={isBaseLayer}
                onClick={this.onDeleteLayer}
                mb={1}
                p={1}
                size="12px"
                type="trash"
              />
            )}
          </Flex>
          {hasMultLayers && this.renderLayerSelector()}
        </Box>
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ChartInspector/format/ChartFormat.js