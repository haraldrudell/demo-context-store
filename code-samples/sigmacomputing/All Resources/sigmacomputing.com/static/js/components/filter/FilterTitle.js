// @flow
import React, { PureComponent } from 'react';

import { Popup, Flex, IconButton, Menu } from 'widgets';
import type { ColumnFilterType } from 'types';

const { MenuItem } = Menu;

type Props = {
  filterTypes: Array<ColumnFilterType>,
  onDelete: () => void,
  setFilterType: ColumnFilterType => void,
  title: string
};

export default class FilterTitle extends PureComponent<Props> {
  onMenuItemClick = (key: ColumnFilterType) => {
    this.props.setFilterType(key);
  };

  onClickMenuTarget = (evt: SyntheticInputEvent<>) => {
    evt.stopPropagation();
  };

  render() {
    const { filterTypes, onDelete, title } = this.props;

    return (
      <Flex align="center" font="header4" justify="space-between" px={3} py={1}>
        {filterTypes.length > 1 ? (
          <Popup
            doNotLayer
            popupPlacement="bottom"
            target={
              <div>
                {title}
                <IconButton mx={1} size="10px" type="caret-down" />
              </div>
            }
            onClickTarget={this.onClickMenuTarget}
          >
            <Menu onMenuItemClick={this.onMenuItemClick}>
              <MenuItem id="topk" name="Top Values" />
              {filterTypes.includes('range') && (
                <MenuItem id="range" name="Range" />
              )}
            </Menu>
          </Popup>
        ) : (
          title
        )}
        <IconButton onClick={onDelete} type="trash" />
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/FilterTitle.js