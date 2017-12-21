// @flow
import React from 'react';
import Color from 'color';

import { Flex, TextSpan, Icon, IconButton } from 'widgets';
import colors from 'styles/colors';

export default function UnsupportedBrowser({
  alertText,
  onClose
}: {
  alertText: string,
  onClose: () => void
}) {
  return (
    <Flex
      bg={Color(colors.yellowAccent)
        .alpha(0.6)
        .string()}
      p={2}
      width="100%"
      justify="space-between"
      align="center"
    >
      <div />
      <Flex align="center" font="header5">
        <Icon type="warning" color="orangeAccent" />
        <TextSpan px={1}>{alertText}</TextSpan>
      </Flex>
      <IconButton type="close" onClick={onClose} />
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/components/BrowserSupport/UnsupportedBrowser.js