// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import { getApiClient } from 'api/client';
import { initErrorTracking } from 'utils/errors';
import { initializeEvents } from 'utils/events';
import App from './App';
import { unregister } from './registerServiceWorker';

initErrorTracking();
initializeEvents();

// Does the user's browser support the HTML5 history API?
// If the user's browser doesn't support the HTML5 history API then we
// will force full page refreshes on each page change.
const supportsHistory = 'pushState' in window.history;

const app = (
  <ApolloProvider client={getApiClient()}>
    <BrowserRouter forceRefresh={!supportsHistory}>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);

ReactDOM.render(app, document.getElementById('root'));
unregister();



// WEBPACK FOOTER //
// ./src/index.js