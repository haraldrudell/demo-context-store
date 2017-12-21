// @flow

import { isProd } from 'env';
import type { EventType } from 'types/events';

// We don't publish to mixpanel in dev, but it's still nice to have access to events
const MASK = 255; // store up to 256 events

export default class DevHandler {
  uid: ?string;
  email: ?string;
  orgId: ?string;
  events: Array<Object>;

  idx: number;
  constructor() {
    if (isProd) {
      throw new Error('BUG: Not for prod!');
    }
    this.events = [];
    window.sigmaEvents = this.events;
    this.idx = 0;
  }

  setUserContext = (uid: ?string, email: ?string, orgId: ?string) => {
    this.uid = uid;
    this.email = email;
    this.orgId = orgId;
  };

  publish = (eventType: EventType, eventData?: Object) => {
    const i = this.idx & MASK;
    this.events[i] = { eventType, eventData, uid: this.uid, email: this.email };
    this.idx++;
  };
}



// WEBPACK FOOTER //
// ./src/utils/events/DevHandler.js