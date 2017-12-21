// @flow

import React, { PureComponent } from 'react';
import { scaleLinear } from 'd3-scale';
import Color from 'color';

import colors from 'styles/colors';
import { Flex } from 'widgets';

export type Bin = {|
  preCount: number,
  postCount: number
|};

function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(max, x));
}

const BRUSH_BAR_WIDTH = 6;

const BrushBar = ({ pos }: { pos: number }) => (
  <g css={`cursor: ew-resize;`} transform={`translate(${pos}, 0)`}>
    <rect
      css={`visibility: hidden;`}
      x={-BRUSH_BAR_WIDTH / 2}
      height="100%"
      width={BRUSH_BAR_WIDTH}
    />
    <circle
      css={`
        stroke: ${colors.darkBlue2};
        fill: white;
      `}
      cx={0}
      cy="50%"
      r={3}
    />
  </g>
);

function highlightRect(chartWidth: number, min: ?number, max: ?number) {
  let offset;
  let width = 0;
  let cursor = 'crosshair';
  if (min != null && max != null) {
    offset = min;
    width = max - min;
    cursor = 'move';
  } else if (min != null) {
    offset = min;
    width = chartWidth - min;
    cursor = 'ew-resize';
  } else if (max != null) {
    offset = 0;
    width = max;
    cursor = 'ew-resize';
  }

  return (
    <rect
      css={`
        cursor: ${cursor};
        fill: ${Color(colors.blueAccent)
          .lighten(0.1)
          .string()};
        fill-opacity: 0.125;
      `}
      height="100%"
      width={width}
      x={offset}
    />
  );
}

class Brush extends PureComponent<
  {
    min: ?number,
    max: ?number,
    onChange?: (?number, ?number) => void,
    width: number
  },
  {|
    isDragging: boolean
  |}
> {
  ref: ?HTMLElement;
  dragMoveCb: ?(SyntheticMouseEvent<>) => void;
  dragStopCb: ?(SyntheticMouseEvent<>) => void;

  constructor(props) {
    super(props);

    this.state = { isDragging: false };
  }

  update(x1: ?number, x2: ?number) {
    const { onChange } = this.props;
    if (!onChange) return;
    if (x1 == null || x2 == null || x1 <= x2) onChange(x1, x2);
    else onChange(x2, x1);
  }

  getDragType(dragStart: number) {
    const { min, max } = this.props;

    // Hover over brush bars.
    if (min != null && Math.abs(dragStart - min) <= BRUSH_BAR_WIDTH / 2)
      return 'ADJUSTING_MIN';
    if (max != null && Math.abs(dragStart - max) <= BRUSH_BAR_WIDTH / 2)
      return 'ADJUSTING_MAX';

    if (min == null) {
      if (max == null) return 'NEW';
      return dragStart <= max ? 'ADJUSTING_MIN' : 'NEW';
    }
    if (max == null) return dragStart >= min ? 'ADJUSTING_MAX' : 'NEW';

    return dragStart < min || dragStart > max ? 'NEW' : 'MOVING';
  }

  onMouseDown = (evt: SyntheticMouseEvent<>) => {
    if (!this.ref) return;
    const rect = this.ref.getBoundingClientRect();
    const refLeft = rect.left;
    const { min, max, width } = this.props;

    this.setState({ isDragging: true });

    const dragStart = evt.clientX - refLeft;
    const state = this.getDragType(dragStart);

    this.dragMoveCb = (moveEvt: SyntheticMouseEvent<>) => {
      const pos = clamp(moveEvt.clientX - refLeft, 0, width);
      switch (state) {
        case 'ADJUSTING_MIN':
          this.update(pos, max);
          break;
        case 'ADJUSTING_MAX':
          this.update(min, pos);
          break;
        case 'MOVING': {
          if (min == null || max == null) throw new Error('Invariant failure');
          let delta = pos - dragStart;
          // Clamp the move so that it doesn't affect the selection size.
          if (min + delta <= 0) delta = -min;
          else if (max + delta >= width) delta = width - max;
          this.update(min + delta, max + delta);
          break;
        }
        default:
          this.update(dragStart, pos);
          break;
      }
      moveEvt.preventDefault();
    };

    this.dragStopCb = (upEvt: SyntheticMouseEvent<>) => {
      this.setState({ isDragging: false });
      upEvt.preventDefault();

      // $FlowFixMe
      document.body.style.cursor = 'auto';

      // $FlowFixMe
      document.removeEventListener('mousemove', this.dragMoveCb);
      this.dragMoveCb = null;
      // $FlowFixMe
      document.removeEventListener('mouseup', this.dragStopCb);
      this.dragStopCb = null;
    };

    // We override the global cursor state so that it represents the action we
    // are doing regardless of whether we're inside the initial drag element.
    let cursor = 'ew-resize';
    if (state === 'MOVING') cursor = 'move';
    else if (state === 'NEW') cursor = 'crosshair';
    // $FlowFixMe
    document.body.style.cursor = cursor;

    // We need to register the mouse handlers globally since the drag may exit
    // the boundaries of the containing `g` element.
    // $FlowFixMe
    document.addEventListener('mousemove', this.dragMoveCb);
    // $FlowFixMe
    document.addEventListener('mouseup', this.dragStopCb);
  };

  setRef = (node: ?HTMLElement) => {
    this.ref = node;
  };

  render() {
    const { isDragging } = this.state;
    const { min, max, width } = this.props;
    return (
      <g
        ref={this.setRef}
        css={`pointer-events: ${isDragging ? 'none' : 'all'};`}
        onMouseDown={this.onMouseDown}
      >
        <rect
          css={`
            visibility: hidden;
            cursor: crosshair;
          `}
          height="100%"
          width={width}
          x={0}
        />
        {highlightRect(width, min, max)}
        {min != null && <BrushBar pos={min} />}
        {max != null && <BrushBar pos={max} />}
      </g>
    );
  }
}

function clipRect(chartWidth: number, min: ?number, max: ?number) {
  let offset;
  let width = '100%';
  if (min != null && max != null) {
    offset = min;
    width = max - min;
  } else if (min != null) {
    offset = min;
    width = chartWidth - min;
  } else if (max != null) {
    offset = 0;
    width = max;
  }

  return <rect height="100%" width={width} x={offset} />;
}

let clipIdGen = 0;

const MIN_BAR_HEIGHT = 10;

type Props = {|
  binStart: number,
  binEnd: number,
  bins: Array<Bin>,
  height: number,
  onSelect?: (?number, ?number) => void,
  selection: [?number, ?number],
  width: number
|};

export default class Histogram extends PureComponent<Props> {
  clipId: string;

  constructor(props: Props) {
    super(props);
    this.clipId = `clip-${clipIdGen++}`;
  }

  getBounds() {
    const { binStart, binEnd, selection } = this.props;
    const [curLo, curHi] = selection;

    let min = binStart;
    if (curLo != null && curLo < min) min = curLo;
    let max = binEnd;
    if (curHi != null && curHi > max) max = curHi;

    return [min, max];
  }

  onBrushChange = (lo: ?number, hi: ?number) => {
    const { onSelect, width } = this.props;
    if (!onSelect) return;

    const [min, max] = this.getBounds();
    const xScale = scaleLinear()
      .domain([0, width])
      .range([min, max]);

    const newLo = lo == null ? null : xScale(lo);
    const newHi = hi == null ? null : xScale(hi);

    // An empty selection is treated as removing any existing bounds.
    if (newLo === newHi) onSelect(null, null);
    else onSelect(newLo, newHi);
  };

  render() {
    const { binStart, binEnd, bins, height, selection, width } = this.props;

    if (bins.length === 0) {
      return (
        <div css={`position: relative;`}>
          <svg height={height} width={width} />
          <Flex
            align="center"
            css={`
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
            `}
            font="bodyLarge"
            justify="center"
            opacity={0.5}
          >
            No Data
          </Flex>
        </div>
      );
    }

    const [min, max] = this.getBounds();
    const xScale = scaleLinear()
      .domain([min, max])
      .range([0, width]);

    const maxCount = bins.reduce(
      (accum, bin) => Math.max(accum, bin.preCount),
      0
    );
    const yScaleBase = scaleLinear()
      .domain([0, maxCount])
      .range([height, MIN_BAR_HEIGHT]);
    const yScale = y => {
      if (y === 0) return height;
      return yScaleBase(y) - MIN_BAR_HEIGHT;
    };

    const binWidth = (binEnd - binStart) / bins.length;
    const xBinWidth = xScale(binStart + binWidth) - xScale(binStart);
    const yBase = yScale(0);

    let prePath = `M ${xScale(binStart)} ${yBase}`;
    let postPath = `M ${xScale(binStart)} ${yBase}`;
    bins.forEach(bin => {
      prePath += ` V ${yScale(bin.preCount)} h ${xBinWidth}
        V ${yBase}`;
      postPath += ` V ${yScale(bin.postCount)} h ${xBinWidth}
        V ${yBase}`;
    });

    const [curLo, curHi] = selection;
    const rMin = curLo == null ? null : xScale(curLo);
    const rMax = curHi == null ? null : xScale(curHi);

    // XXX JDF: add axis
    return (
      <svg height={height} width={width}>
        <clipPath id={this.clipId}>{clipRect(width, rMin, rMax)}</clipPath>
        <path
          css={`
            fill: ${colors.darkBlue5};
            stroke: white;
          `}
          d={prePath}
        />
        <g css={`stroke: white;`} clipPath={`url(#${this.clipId})`}>
          <path
            css={`fill: ${Color(colors.blueAccent)
              .lighten(0.25)
              .string()};`}
            d={prePath}
          />
          <path
            css={`fill: ${Color(colors.blueAccent)
              .lighten(0.05)
              .string()};`}
            d={postPath}
          />
        </g>
        <Brush
          min={rMin}
          max={rMax}
          onChange={this.onBrushChange}
          width={width}
        />
      </svg>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/RangeHistogram.js