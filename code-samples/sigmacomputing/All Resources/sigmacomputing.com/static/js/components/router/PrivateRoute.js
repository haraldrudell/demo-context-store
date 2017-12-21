// @flow
import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';

import { isLoggedInToOrg } from 'utils/auth';

type Props = {
  component: React.ComponentType<*>,
  publicComponent?: React.ComponentType<*>,
  location?: string
};

export default function PrivateRoute({
  component: Component,
  publicComponent: PublicComponent,
  ...rest
}: Props) {
  const renderRoute = props => {
    if (isLoggedInToOrg()) {
      return <Component {...props} />;
    } else if (PublicComponent) {
      // Since we're not authenticated we show an alternate screen
      return <PublicComponent {...props} />;
    } else {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      );
    }
  };

  return <Route {...rest} render={renderRoute} />;
}



// WEBPACK FOOTER //
// ./src/components/router/PrivateRoute.js