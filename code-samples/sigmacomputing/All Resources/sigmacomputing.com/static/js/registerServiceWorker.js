// @flow
// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

import Raven from 'raven-js';

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;
      const { serviceWorker } = navigator;
      if (serviceWorker) {
        serviceWorker
          .register(swUrl)
          .then(registration => {
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (serviceWorker.controller) {
                    // At this point, the old content will have been purged and
                    // the fresh content will have been added to the cache.
                    // It's the perfect time to display a "New content is
                    // available; please refresh." message in your web app.
                    Raven.captureMessage('SW: New Content Available.');
                    console.log('New content is available; please refresh.'); //eslint-disable-line
                  } else {
                    // At this point, everything has been precached.
                    // It's the perfect time to display a
                    // "Content is cached for offline use." message.
                    console.log('Content is cached for offline use.'); //eslint-disable-line
                  }
                }
              };
            };
          })
          .catch(error => {
            Raven.captureMessage('SW: Error during registration.');
            console.error('Error during service worker registration:', error); //eslint-disable-line
          });
      }
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    const { serviceWorker } = navigator;
    if (serviceWorker) {
      serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }
}



// WEBPACK FOOTER //
// ./src/registerServiceWorker.js