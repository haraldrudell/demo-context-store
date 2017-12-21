// @flow
import * as React from 'react';
import Link from 'react-router-dom/Link';

import { Text } from 'widgets';
import TwitterIcon from 'icons/twitter.svg';
import styles from './Footer.less';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.row} flex-row`}>
        <div className={styles.column}>
          <Text align="left">hello@sigmacomputing.com</Text>
          <div className={styles.copyright}>© 2017 Sigma Computing Inc</div>
        </div>
        <div className={styles.column}>
          <a href="https://twitter.com/sigmacomputing">
            <img
              alt="Twitter"
              className={styles.socialIcon}
              src={TwitterIcon}
            />
          </a>
        </div>
        <div className={styles.column}>
          <Link to="/terms" className={styles.link}>
            Terms
          </Link>
          <br className={styles.break} />
          <Link to="/careers" className={styles.link}>
            Careers
          </Link>
        </div>
      </div>
    </footer>
  );
}



// WEBPACK FOOTER //
// ./src/components/footer/Footer.js