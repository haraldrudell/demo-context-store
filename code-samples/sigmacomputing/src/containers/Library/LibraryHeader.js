// @flow
import React from 'react';

import { Flex, Text } from 'widgets';
import Logo from 'icons/logo_dark.svg';
import UserMenu from 'components/nav/UserMenu';
import HelpPopup from 'components/Help/HelpPopup';

type Props = {
  openHelp: boolean
};

export default function LibraryHeader({ openHelp }: Props) {
  return (
    <Flex bb={1} borderColor="darkBlue4" justify="space-between" px={4} py={2}>
      <Flex align="center">
        <img css={`height: 30px;`} src={Logo} alt="Sigma" />
        <Text font="header2" ml={2}>
          Sigma
        </Text>
      </Flex>
      <Flex align="center">
        <HelpPopup openHelp={openHelp} />
        <UserMenu />
      </Flex>
    </Flex>
  );
}



// WEBPACK FOOTER //
// ./src/containers/Library/LibraryHeader.js