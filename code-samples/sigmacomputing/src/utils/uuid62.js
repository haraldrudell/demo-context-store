// @flow
import uuid from 'uuid';
import baseX from 'base-x';
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const bs62 = baseX(BASE62);

export function encodeId(id: string) {
  const bytes = Buffer.from(id.replace(/-/g, ''), 'hex');
  return bs62.encode(bytes);
}

export function decodeId(encodedId: string) {
  const chars = bs62
    .decode(encodedId)
    .toString('hex')
    .split('');
  // Add hyphens back in
  [8, 13, 18, 23].forEach(function(idx) {
    chars.splice(idx, 0, '-');
  });
  // Return UUID in form of "109156be-c4fb-41ea-b1b4-efe1671c5836"
  return chars.join('');
}

export default function v4(): string {
  const id = uuid.v4();
  return encodeId(id);
}



// WEBPACK FOOTER //
// ./src/utils/uuid62.js