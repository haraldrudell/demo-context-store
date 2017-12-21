// @flow
import * as React from 'react';

import { Box, Checkbox, Flex, TextSpan } from 'widgets';

type Props = {
  count: ?number,
  includeNulls: boolean,
  onChange?: () => void
};

export default function NullFilter({ count, includeNulls, onChange }: Props) {
  return (
    <Flex
      align="center"
      font="header5"
      justify="space-between"
      py={2}
      px={3}
      width="100%"
    >
      <Checkbox checked={includeNulls} onChange={onChange}>
        <TextSpan font="header5">Include Nulls</TextSpan>
      </Checkbox>
      {count != null && (
        <Box color="darkBlue3">{`${count} Null${count !== 1 ? 's' : ''}`}</Box>
      )}
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/components/filter/NullFilter.js