// @flow
import * as React from 'react';

import { Flex, Text } from 'widgets';

import EmptyDashboardIcon from 'icons/EmptyDashboard.svg';

const EmptyDashboard = () => (
  <Flex align="center" color="darkBlue3" column justify="center" mt={5}>
    <img
      css={`
        height: 128px;
        width 128px;
      `}
      alt=""
      src={EmptyDashboardIcon}
    />
    <Text font="header2">New Dashboard</Text>
    <Text font="header3">Click on the Add Chart button to insert a chart</Text>
  </Flex>
);

export default EmptyDashboard;



// WEBPACK FOOTER //
// ./src/containers/Dashboard/EmptyDashboard.js