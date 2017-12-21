// @flow
import invariant from 'invariant';

export type AxisTitleOptions = {
  xTitle?: string,
  yTitle?: string,
  fontSize?: string
};

export type AxisOptions = {
  fontSize?: string,
  labelAngle?: string
};

export type LegendOptions = {
  hasLegend?: boolean,
  labelFontSize?: string,
  titleFontSize?: string,
  orient?: string
};

export type ChartTitleOptions = {
  hasTitle?: boolean,
  text: string,
  fontSize?: string
};

export type TooltipOptions = {
  hasTooltip?: boolean
};

export type MiscOptions = {
  hasBorder?: boolean
};

export default class ChartConfig {
  title: ChartTitleOptions;
  legend: LegendOptions;
  axisTitle: AxisTitleOptions;
  axisX: AxisOptions;
  axisY: AxisOptions;
  misc: MiscOptions;
  tooltip: TooltipOptions;

  constructor() {
    this.title = { text: 'New Chart' };
    this.legend = {};
    this.misc = {};
    this.axisTitle = {};
    this.axisX = {};
    this.axisY = {};
    this.tooltip = {};
  }

  toggleTitle() {
    this.title.hasTitle =
      this.title.hasTitle === undefined ? false : !this.title.hasTitle;
  }

  toggleLegend() {
    this.legend.hasLegend =
      this.legend.hasLegend === undefined ? false : !this.legend.hasLegend;
  }

  toggleBorder() {
    this.misc.hasBorder = !this.misc.hasBorder;
  }

  toggleTooltip() {
    this.tooltip.hasTooltip =
      this.tooltip.hasTooltip === undefined ? false : !this.tooltip.hasTooltip;
  }

  setTitle(title: string) {
    this.title.text = title;
  }

  updateTitleConfig(title: ChartTitleOptions) {
    invariant(title, 'Title was undefined');
    this.title = title;
  }

  updateTooltip(tooltip: TooltipOptions) {
    invariant(tooltip, 'Tooltip was undefined');
    this.tooltip = tooltip;
  }

  updateAxisTitle(axisTitle: AxisTitleOptions) {
    invariant(axisTitle, 'Axis Title was undefined');
    this.axisTitle = axisTitle;
  }

  updateAxis(id: 'x' | 'y', axis: AxisOptions) {
    invariant(axis, 'Axis was undefined');
    if (id === 'x') {
      this.axisX = axis;
    } else {
      this.axisY = axis;
    }
  }

  updateMisc(misc: MiscOptions) {
    invariant(misc, 'Misc was undefined');
    this.misc = misc;
  }

  updateLegend(legend: LegendOptions) {
    invariant(legend, 'Legend was undefined');
    this.legend = legend;
  }
}



// WEBPACK FOOTER //
// ./src/utils/chart/ChartConfig.js