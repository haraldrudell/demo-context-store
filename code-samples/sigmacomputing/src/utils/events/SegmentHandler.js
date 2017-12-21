// @flow
import type { EventType } from 'types/events';

// see: https://segment.com/docs/sources/website/analytics.js/quickstart/#step-1-copy-the-snippet

// TODO: store elsewhere?
const API_TOKEN = 'DKSCX43BzqWfiQCruQOFlLQ56PTw1mwX';

export default class SegmentHandler {
  constructor() {
    (function initSegment() {
      const analytics = (window.analytics || []: any);
      window.analytics = analytics;

      if (analytics.initialize) return;
      if (analytics.invoked) return;
      analytics.invoked = true;

      analytics.methods = [
        'trackSubmit',
        'trackClick',
        'trackLink',
        'trackForm',
        'pageview',
        'identify',
        'reset',
        'group',
        'track',
        'ready',
        'alias',
        'debug',
        'page',
        'once',
        'off',
        'on'
      ];

      analytics.factory = function factory(method) {
        return function factoryHelper(...args) {
          args.unshift(method);
          analytics.push(args);
          return analytics;
        };
      };

      for (let i = 0; i < analytics.methods.length; i++) {
        const method = analytics.methods[i];
        analytics[method] = analytics.factory(method);
      }

      analytics.load = function load(key) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        script.src = `https://cdn.segment.com/analytics.js/v1/${key}/analytics.min.js`;

        const first = document.getElementsByTagName('script')[0];
        if (first && first.parentNode) {
          first.parentNode.insertBefore(script, first);
        }
      };

      analytics.SNIPPET_VERSION = '4.0.0';
      analytics.load(API_TOKEN);
    })();
  }

  setUserContext = (uid: ?string, email: ?string, orgId: ?string) => {
    window.analytics.reset();
    window.analytics.identify(uid, { email, orgId });
  };

  publish = (eventType: EventType, eventData?: Object) => {
    window.analytics.track(eventType, eventData || {});
  };
}



// WEBPACK FOOTER //
// ./src/utils/events/SegmentHandler.js