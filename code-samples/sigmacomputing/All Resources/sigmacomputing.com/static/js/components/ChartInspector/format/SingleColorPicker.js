// @flow
import * as React from 'react';
import * as vega from 'vega';

import { Box, Flex, Popover } from 'widgets';

const DEFAULT_SCHEME = vega.scheme('tableau10');

const ColorMenu = ({
  current,
  onChange
}: {
  current: string,
  onChange: string => void
}) => (
  <Flex>
    {DEFAULT_SCHEME.map((color, idx) => {
      const isCur = current === color;
      return (
        <Box
          key={color}
          css={`
            height: 24px;
            width: 24px;
            cursor: ${isCur ? 'default' : 'pointer'};
          `}
          bg={color}
          ml={idx ? 2 : 0}
          onClick={isCur ? null : () => onChange(color)}
        />
      );
    })}
  </Flex>
);

export default function SingleColorPicker({
  disabled,
  onSelect,
  selected
}: {
  disabled: boolean,
  onSelect: string => void,
  selected?: string
}) {
  const current = selected || DEFAULT_SCHEME[0];
  const box = (
    <Box
      css={`
        height: 1em;
        width: 1em;
        cursor: ${disabled ? 'default' : 'pointer'};
      `}
      b={1}
      bg={disabled ? 'darkBlue6' : current}
      borderColor="darkBlue4"
      borderRadius="2px"
    />
  );

  return disabled ? (
    box
  ) : (
    <Popover
      content={<ColorMenu current={current} onChange={onSelect} />}
      placement="left"
      trigger="click"
    >
      {box}
    </Popover>
  );
}



// WEBPACK FOOTER //
// ./src/components/ChartInspector/format/SingleColorPicker.js