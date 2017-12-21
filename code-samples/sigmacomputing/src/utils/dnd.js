// @flow

const isWin = navigator.appVersion.indexOf('Win') !== -1;

// Drags default to move
// If you hold alt (mac) or ctrl (windows), it copies instead
export function isCopyDrag(): boolean {
  // react-dnd doens't expose the event so we hack to window.event
  // which firefox doesn't support so it's always a move in the fox
  if (!window.event) return false;

  return Boolean(isWin ? window.event.ctrlkey : window.event.altKey);
}



// WEBPACK FOOTER //
// ./src/utils/dnd.js