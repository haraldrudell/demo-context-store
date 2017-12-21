// @flow
import * as React from 'react';

import { Text, TextSpan, Flex, Box, IconButton } from 'widgets';
import GettingStarted from './GettingStarted';
import PopularResources from './PopularResources';
import HelpLink from './HelpLink';
import ContactUs from './ContactUs';
import { helpURL } from './resources';

type Props = {
  onClose: () => void
};

export default class Help extends React.Component<Props, void> {
  render() {
    const { onClose } = this.props;

    return (
      <Flex column color="darkBlue2" bg="white">
        <Flex
          bb={1}
          borderColor="darkBlue5"
          justify="space-between"
          align="center"
          py={3}
          px={4}
        >
          <Text font="header3">Welcome to Sigma</Text>
          <Box>
            <TextSpan pr={1}>Go to our</TextSpan>
            <HelpLink to={helpURL}>Help</HelpLink>
            <TextSpan pl={1} pr={3}>
              page to learn more
            </TextSpan>
            <IconButton onClick={onClose} type="close" />
          </Box>
        </Flex>
        <Flex column px={4} py={3}>
          <Flex column align="center">
            <Text py={3} font="header3">
              How to get started
            </Text>
            <GettingStarted />
          </Flex>
          <Text pt={3} pl={2}>
            Popular Resources
          </Text>
          <PopularResources py={2} width="80%" />
        </Flex>
        <Box bt={1} borderColor="darkBlue5" py={3} px={4} bg="darkBlue6">
          <TextSpan pr={2}>Feedback / Questions?</TextSpan>
          <ContactUs />
        </Box>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/Help/Help.js