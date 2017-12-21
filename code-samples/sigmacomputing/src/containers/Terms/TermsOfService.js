// @flow
import React, { PureComponent } from 'react';

import Layout from 'components/layout/LandingLayout';
import styles from './TermsOfService.less';

export default class TermsOfService extends PureComponent<{}> {
  terms: any;
  componentDidMount() {
    window.addEventListener('resize', this.onUpdateFrameHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onUpdateFrameHeight);
  }

  onUpdateFrameHeight = () => {
    const { terms } = this;
    terms.style.height = 0;
    terms.style.height = `${terms.contentWindow.document.body.scrollHeight}px`;
  };

  setTermsRef = (r: any) => {
    this.terms = r;
  };

  render() {
    return (
      <Layout header={<div className={styles.title}>Terms of Service</div>}>
        <div className={`${styles.container} g_container`}>
          <iframe
            ref={this.setTermsRef}
            title="Terms of Service"
            frameBorder={0}
            scrolling="no"
            width="100%"
            onLoad={this.onUpdateFrameHeight}
            src="/sigma_computing_platform_terms_of_use.html"
          />
        </div>
      </Layout>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Terms/TermsOfService.js