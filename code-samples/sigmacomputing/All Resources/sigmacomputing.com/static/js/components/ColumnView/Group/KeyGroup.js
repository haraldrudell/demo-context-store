// @flow
import * as React from 'react';
import classnames from 'classnames/bind';

import { Box, Flex, Icon } from 'widgets';
import { ColumnPlaceholder } from '../Column/ColumnDropzone';
import styles from './TreeGroup.less';
const cx = classnames.bind(styles);

export default function KeyGroup({
  children,
  isOver = true
}: {
  children?: React.Node,
  isOver?: boolean
}) {
  return (
    <Box className={cx('keyGroup')} mb={2} p={2}>
      <Flex align="center" font="header6" mb={1} px={2}>
        <Icon className={cx('keyIcon')} type="key" />
        GROUP BY
      </Flex>
      {children ? (
        children
      ) : (
        <ColumnPlaceholder isOver={isOver} text="Drop Grouping Key Here" />
      )}
    </Box>
  );
}



// WEBPACK FOOTER //
// ./src/components/ColumnView/Group/KeyGroup.js