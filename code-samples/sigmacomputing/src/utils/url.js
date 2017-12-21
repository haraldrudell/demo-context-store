// @flow
import getSlug from 'speakingurl';
import { decodeId, encodeId } from 'utils/uuid62';

export function decodeWorksheetUrl(url: string) {
  const encodedId = url.split('-').pop();
  return decodeId(encodedId);
}

export function encodeWorksheetUrl(workbookId: string, workbookTitle: string) {
  const urlTitle = getSlug(workbookTitle || 'Untitled', { maintainCase: true });
  return `/d/${urlTitle}-${encodeId(workbookId)}`;
}

export const WORKSHEET_PATH = '/d/:title?-:encodedUrl';

export function encodeDashboardUrl(dashboardId: string, title: string) {
  const urlTitle = getSlug(title || 'Untitled', { maintainCase: true });
  return `/db/${urlTitle}-${encodeId(dashboardId)}`;
}

export function decodeDashboardUrl(url: string) {
  const dashboardId = url.split('-').pop();
  return decodeId(dashboardId);
}

export const DASHBOARD_PATH = '/db/:title?-:dashboardId';

export function encodeFolderUrl(folderId: string, title: string) {
  const urlTitle = getSlug(title || 'Untitled', { maintainCase: true });
  return `/${urlTitle}-${encodeId(folderId)}`;
}

export function decodeFolderUrl(url: string) {
  if (url === '/') {
    return undefined;
  }
  const folderId = url.split('-').pop();
  return decodeId(folderId);
}

export const FOLDER_PATH = '/:title?-:folderId';

// Parses ?foo=x&bar=y into { foo: x, bar: y }
export function parseQueryString(_qs: string) {
  let qs = _qs;
  // Remove ? and anything preceding
  const i = qs.indexOf('?');
  if (i !== -1) {
    qs = qs.slice(i + 1);
  }
  const ret = {};

  for (const p of qs.split('&')) {
    const eq = p.indexOf('=');
    if (p !== -1) {
      const key = p.slice(0, eq);
      const val = decodeURIComponent(p.slice(eq + 1) || '');
      ret[key] = val;
    }
  }
  return ret;
}



// WEBPACK FOOTER //
// ./src/utils/url.js