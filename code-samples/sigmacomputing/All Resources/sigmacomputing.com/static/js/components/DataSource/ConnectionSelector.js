// @flow
import React, { Component } from 'react';

import type { TableObject } from 'types/table';
import type { DbConnectionType, Id } from 'types';
import SelectScope from './SelectScope';
import { GoogleOAuthFlow } from 'utils/oauth2';

function makeConnectionListResults(connections): ?Array<TableObject> {
  if (!connections) return null;
  const list = [];
  for (const id in connections) {
    list.push({ name: connections[id].label, scope: [] });
  }
  return list;
}

type Props = {
  connections: { [string]: DbConnectionType },
  selectConnection?: Id => void,
  selectedConnection: ?{ id: Id, label: string }
};

export default class ConnectionSelector extends Component<
  Props,
  {
    connectionListResults: ?Array<TableObject>,
    fetchGoogleToken: boolean,
    onFetchGoogleToken: ?(?string) => void
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      connectionListResults: makeConnectionListResults(this.props.connections),
      fetchGoogleToken: false,
      onFetchGoogleToken: null
    };
  }

  selectConnection = (value: string) => {
    const { connections, selectConnection } = this.props;

    let connection: ?[Id, DbConnectionType] = null;
    for (const id in connections) {
      const c = connections[id];
      if (c && c.label === value) {
        connection = [id, c];
        break;
      }
    }

    if (!(connection && selectConnection)) {
      throw new Error(`Connection Not Found: ${value}`);
    }

    const [id, c] = connection;
    if (c.type !== 'bigQuery') {
      selectConnection(id);
      return;
    }

    const handler = (token: ?string) => {
      this.setState({
        fetchGoogleToken: false,
        onFetchGoogleToken: null
      });

      if (token) {
        selectConnection(id);
        return;
      }
    };

    this.setState({
      fetchGoogleToken: true,
      onFetchGoogleToken: handler
    });
  };

  render() {
    const { selectedConnection } = this.props;
    const {
      connectionListResults,
      fetchGoogleToken,
      onFetchGoogleToken
    } = this.state;

    return (
      <div>
        <GoogleOAuthFlow
          active={fetchGoogleToken}
          onComplete={onFetchGoogleToken}
        />
        <SelectScope
          isLoading={false}
          scope="connection"
          setSelectedScope={this.selectConnection}
          selectedScope={selectedConnection && selectedConnection.label}
          listScopeResult={connectionListResults}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/ConnectionSelector.js