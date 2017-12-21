// @flow
import React from 'react';
import { detect } from 'detect-browser';
import cmp from 'semver-compare';
import { capitalize } from 'lodash';

import UnsupportedBrowser from './UnsupportedBrowser';

const minBrowserVersions = {
  chrome: '29.0',
  edge: '15.0',
  firefox: '28.0',
  ie: '11.0',
  opera: '15.0',
  safari: '11.0'
};

export default class BrowserSupport extends React.Component<
  {},
  {
    browser: any,
    supported: boolean,
    showBanner: boolean
  }
> {
  constructor(props: {}) {
    super(props);
    const browser = detect();
    const supported = this.checkSupport(browser);
    this.state = {
      browser,
      supported,
      showBanner: !supported
    };
  }

  checkSupport = (browser: any) => {
    if (!browser || !minBrowserVersions[browser.name]) return false;
    const browserVersion = minBrowserVersions[browser.name];
    return cmp(browser.version, browserVersion) < 0 ? false : true;
  };

  onCloseBanner = () => {
    this.setState({ showBanner: false });
  };

  render() {
    const { browser, supported, showBanner } = this.state;

    if (supported || !showBanner) return null;

    return (
      <UnsupportedBrowser
        onClose={this.onCloseBanner}
        alertText={
          browser && browser.name
            ? `For a better experience on Sigma, update your ${capitalize(
                browser.name
              )} browser.`
            : 'For a better experience on Sigma, update your browser.'
        }
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/BrowserSupport/index.js