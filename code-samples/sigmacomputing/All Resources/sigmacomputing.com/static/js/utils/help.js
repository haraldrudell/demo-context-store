// @flow

import { type FuncDef } from '@sigmacomputing/sling';

import { publish } from 'utils/events';
import { sling_help_url, function_help_url } from 'utils/zendesk';

// Open help on the given topic, or general sling documentation
export function openDocLink(fn: ?FuncDef) {
  const url = fn ? function_help_url(fn) : sling_help_url();
  publish('OpenHelp', { name: fn && fn.name });
  window.open(url, 'functionHelpWindow');
}



// WEBPACK FOOTER //
// ./src/utils/help.js