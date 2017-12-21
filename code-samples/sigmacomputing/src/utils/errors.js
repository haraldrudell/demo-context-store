// @flow

import Raven from 'raven-js';

import { isStaging, isProd, COMMIT_HASH } from 'env';

export function initErrorTracking() {
  if (isProd) {
    Raven.config('https://cb1c7df118494ace90485e1ebbaacba7@sentry.io/157435', {
      release: isStaging ? 'staging-0.1' : COMMIT_HASH,
      tags: { git_commit: COMMIT_HASH },
      autoBreadcrumbs: {
        console: false, // ignore console logs
        xhr: false // XMLHttpRequest
      },
      captureUnhandledRejections: true
    }).install();

    const old = console.error; // eslint-disable-line

    /*eslint-disable */
    // $FlowFixMe
    console.error = function(e) {
      // eslint-disable-line
      if (e instanceof Error) {
        Raven.captureException(e);
      } else {
        Raven.captureMessage(e);
      }
      old.apply(this, arguments);
    };
    /*eslint-enable*/
  }
}

export function captureException(e: Error, extra: any) {
  if (isProd) {
    Raven.captureException(e, { extra });
  } else {
    console.log('captured exception:', e); // eslint-disable-line
    console.log('-- ', extra); // eslint-disable-line
    throw e;
  }
}



// WEBPACK FOOTER //
// ./src/utils/errors.js