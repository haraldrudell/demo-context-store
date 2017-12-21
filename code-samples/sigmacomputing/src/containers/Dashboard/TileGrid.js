// @flow
import * as React from 'react';
import Measure from 'react-measure';
import { css } from 'react-emotion';
import ReactGridLayout from 'react-grid-layout';

import { Box, Icon } from 'widgets';
import colors from 'styles/colors';

const GRID_NUM_COLS = 12;
const GRID_ROW_HEIGHT = 32;
const GRID_MARGINS = [12, 12];

// This is mostly copied from react-grid-layout/css/styles.css, but has a few tweaks.
const gridClass = css`
  position: relative;
  transition: height 200ms ease;

  & .react-grid-item {
    background-color: white;
    border: 1px solid ${colors.darkBlue4};
    box-shadow: 0 1px 1px 0 ${colors.darkBlue5};
    transition: all 200ms ease;
    transition-property: left, top;
  }

  & .react-grid-item.cssTransforms {
    transition-property: transform;
  }

  & .react-grid-item.resizing {
    z-index: 1;
    will-change: width, height;
  }

  & .react-grid-item.react-draggable {
    cursor: grab;
  }

  & .react-grid-item.react-draggable-dragging {
    transition: none;
    z-index: 3;
    will-change: transform;
    cursor: grabbing;
  }

  & .react-grid-item.react-grid-placeholder {
    background: ${colors.darkBlue5};
    opacity: 0.3;
    transition-duration: 100ms;
    z-index: 2;
    user-select: none;
  }

  & .react-resizable-handle {
    position: absolute;
    height: 16px;
    width: 16px;
    bottom: 0;
    right: 0;
    background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
    background-position: bottom right;
    padding: 0 4px 4px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    cursor: nwse-resize;
  }
`;

export type TileLayout = {|
  x: number,
  y: number,
  w: number,
  h: number
|};

type GridLayout = Array<{
  ...TileLayout,
  i: string
}>;

// XXX JDF: Enforce that data-grid is set to TileLayout.
export const Tile = ({
  children,
  ...rest
}: {
  children: React.Element<any>
}) => (
  <Box {...rest}>
    {children}
    <Icon
      css={`
        position: absolute;
        top: 0;
        left: 0;
      `}
      m={1}
      type="drag-handle"
    />
  </Box>
);

type TileGridProps = {|
  isLocked: boolean,
  onLayoutChange?: ({ [string]: TileLayout }) => void,
  renderTiles: () => Array<React.Element<any>>
|};

export class TileGrid extends React.Component<
  TileGridProps,
  {|
    width: number
  |}
> {
  constructor(props: TileGridProps) {
    super(props);
    this.state = {
      width: 0
    };
  }

  handleResize = (rect: { bounds: { width: number } }) => {
    const { width } = rect.bounds;
    this.setState({ width });
  };

  handleLayoutChange = (layout: GridLayout) => {
    const { onLayoutChange } = this.props;
    if (!onLayoutChange) return;

    const newLayout = {};
    layout.forEach(({ x, y, w, h, i }) => {
      newLayout[i] = { x, y, w, h };
    });
    onLayoutChange(newLayout);
  };

  render() {
    const { width } = this.state;
    const { isLocked, renderTiles } = this.props;

    return (
      <Measure bounds onResize={this.handleResize}>
        {({ measureRef }) => (
          <div ref={measureRef}>
            <ReactGridLayout
              cols={GRID_NUM_COLS}
              className={gridClass}
              isDraggable={!isLocked}
              isResizable={!isLocked}
              margin={GRID_MARGINS}
              onLayoutChange={this.handleLayoutChange}
              rowHeight={GRID_ROW_HEIGHT}
              width={width}
              verticalCompact={false}
            >
              {renderTiles()}
            </ReactGridLayout>
          </div>
        )}
      </Measure>
    );
  }
}

export function calcNewTilePos(layout: Array<TileLayout>) {
  return {
    x: 0,
    y: layout.reduce((curMax, { y, h }) => Math.max(y + h, curMax), 0)
  };
}



// WEBPACK FOOTER //
// ./src/containers/Dashboard/TileGrid.js