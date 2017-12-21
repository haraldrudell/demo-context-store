// @flow
import React, { Component } from 'react';

export default function asyncComponent(importComponent: () => Promise<any>) {
  class AsyncComponent extends Component<
    any,
    {
      component: ?any
    }
  > {
    constructor(props: any) {
      super(props);

      this.state = {
        component: null
      };
    }

    componentDidMount() {
      importComponent().then(({ default: component }) => {
        this.setState({
          component
        });
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}



// WEBPACK FOOTER //
// ./src/components/router/AsyncComponent.js