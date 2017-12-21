// @flow
import React, { PureComponent } from 'react';

import { createConnection } from 'api/connection';
import UpdateConnection from './UpdateConnection';

export default class NewConnection extends PureComponent<{}> {
  render() {
    return (
      <UpdateConnection
        submitText="Create Connection"
        title="New Connection"
        updateConnection={createConnection}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Connection/NewConnection.js