// @flow
import * as React from 'react';
import Color from 'color';

import colors from 'styles/colors';

import { Flex, Text, TextSpan } from 'widgets';
import Layout from 'components/layout/LandingLayout';
import GettingStarted from 'components/Help/GettingStarted';
import PopularResources from 'components/Help/PopularResources';
import ResourceClumps from 'components/Help/ResourceClumps';
import ContactUs from 'components/Help/ContactUs';

export default class HelpPage extends React.PureComponent<void> {
  render() {
    return (
      <Layout help>
        <Flex
          column
          align="center"
          py={5}
          bg="lightBlue"
          borderColor="darkBlue4"
          by={1}
        >
          <Text pb={4} font="web1">
            How can we help?
          </Text>
          {/**<input value="Find anything" /> **/}
        </Flex>

        <div className="g_container">
          <Flex column align="center" px={4} py={5}>
            <Text pb={5} font="web2">
              How to get Started in Sigma
            </Text>
            <GettingStarted />
            <Text py={5} font="web2">
              Popular Articles
            </Text>
            <PopularResources size="large" />
          </Flex>
        </div>

        <Flex
          bg={Color(colors.darkBlue4)
            .alpha(0.3)
            .string()}
          py={5}
          column
          align="center"
        >
          <ResourceClumps />
        </Flex>
        <div className="g_container">
          <Flex wrap align="center" justify="space-between" pt={5}>
            <TextSpan font="web2">Still need help?</TextSpan>
            <ContactUs button />
          </Flex>
        </div>
      </Layout>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/HelpPage/HelpPage.js