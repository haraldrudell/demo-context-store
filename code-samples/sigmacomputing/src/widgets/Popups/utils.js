// @flow
import * as React from 'react';
import { css } from 'emotion';

import colors from 'styles/colors';
import zIndex from 'styles/zindex.js';

export const popupContentStyle = css`
  border-radius: 2px;
  background-color: ${colors.darkBlue6};
  border: solid 1px ${colors.darkBlue4};
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  z-index: ${zIndex.zindexPopover};
  position: fixed;
`;

export type ButtonItem = {
  id: string,
  name: string,
  iconType?: ?string,
  onMenuItemClick?: (?string) => void,
  example?: ?string,
  disabled?: ?boolean
};

export type MenuItem_t = React.Element<any> | false;
export type MenuItems_t = React.ChildrenArray<?MenuItem_t>;



// WEBPACK FOOTER //
// ./src/widgets/Popups/utils.js