// @flow
import * as React from 'react';
import invariant from 'invariant';
import { keyframes } from 'react-emotion';

import { Flex, Icon, Text, Tooltip } from 'widgets';
import type { Status } from 'types';
import { isProd, isStaging } from 'env';

type Props = {
  rowCount: React.Element<any>,
  showSql: React.Element<any>,
  status: ?Status
};

const ENABLE_SHOW_SQL = !isProd || isStaging;

const colorchange = keyframes`
  0% {
    background: rgba(255, 160, 0, 1);
  }

  25% {
    background: rgba(255, 160, 0, 0.8);
  }

  50% {
    background: rgba(255, 160, 0, 0.6);
  }

  75% {
    background: rgba(255, 160, 0, 0.4);
  }

  100% {
    background: transparent;
  }
`;

export default class StatusBar extends React.PureComponent<Props> {
  renderStatus = () => {
    const { status } = this.props;
    if (!status || status.type === 'loading') return null;
    invariant(status.type === 'error', `Unexpected status: ${status.type}`);

    const { message, info } = status;
    return (
      <Flex align="center">
        <Icon color="redAccent" mr={1} type="warning" />
        <Text font="bodyMedium" truncate>
          {info}
          {message && (
            <span>
              :&nbsp;
              <Tooltip trigger="click" placement="top" title={message}>
                <a>Details</a>
              </Tooltip>
            </span>
          )}
        </Text>
      </Flex>
    );
  };

  render() {
    const { rowCount, showSql, status } = this.props;
    const hasError = status && status.type === 'error';

    return (
      <Flex
        css={`
          height: 32px;
          ${hasError ? `animation: ${colorchange} 0.5s;` : ''};
        `}
        align="center"
        bg="darkBlue6"
        bt={1}
        borderColor="darkBlue4"
        font="header5"
        pl={4}
        pr={3}
        justify="space-between"
      >
        {rowCount}
        <Flex align="center">
          {this.renderStatus()}
          {ENABLE_SHOW_SQL && showSql}
        </Flex>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/StatusBar/index.js