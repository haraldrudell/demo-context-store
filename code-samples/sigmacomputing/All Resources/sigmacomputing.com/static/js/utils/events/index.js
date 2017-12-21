// @flow
import { isProd, isStaging, COMMIT_HASH } from 'env';
import type { EventType } from 'types/events';
import uuid from 'uuid';

import SegmentHandler from './SegmentHandler';
import DevHandler from './DevHandler';

// Publish Monitoring events to mixpanel etc
let handler;
let sessionId;

const sigmaEnv = isStaging ? 'staging' : isProd ? 'prod' : 'dev';

export function setUserContext(uid: ?string, email: ?string, orgId: ?string) {
  if (handler) handler.setUserContext(uid, email, orgId);
}

export function publish(eventType: EventType, _eventData?: Object) {
  if (!handler) return;

  const eventData = { ..._eventData, sigmaEnv };

  // We inject some globals into every request.
  eventData.sessionId = sessionId;
  if (isProd) eventData.gitCommit = COMMIT_HASH;

  handler.publish(eventType, eventData);
}

export function initializeEvents() {
  sessionId = uuid
    .v4()
    .split('-')
    .join('');

  if (isProd) {
    handler = new SegmentHandler();
  } else {
    // use janky dev event handler
    handler = new DevHandler();
  }
}



// WEBPACK FOOTER //
// ./src/utils/events/index.js