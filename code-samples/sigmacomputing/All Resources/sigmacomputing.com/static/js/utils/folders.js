// @flow
import invariant from 'invariant';

import {
  encodeDashboardUrl,
  encodeFolderUrl,
  encodeWorksheetUrl
} from 'utils/url';
import type { FolderSummaryTy, InodeSummaryTy } from 'types';
import { ORG_ROOT_ID, getHomeInodeId } from 'api/organization';

export function folderIsSystem(folder: { ...FolderSummaryTy }) {
  return folder.parent === null || folder.inodeId === ORG_ROOT_ID;
}

export function encodeInodeUrl(inode: InodeSummaryTy) {
  switch (inode.type) {
    case 'worksheet':
      return encodeWorksheetUrl(inode.inodeId, inode.name);
    case 'dashboard':
      return encodeDashboardUrl(inode.inodeId, inode.name);
    case 'folder':
    default:
      invariant(inode.type === 'folder', `Unknown inode type: ${inode.type}`);
      if (inode.inodeId === getHomeInodeId()) return '/';
      return encodeFolderUrl(inode.inodeId, inode.name);
  }
}

export function getInodeIconType(inode: InodeSummaryTy) {
  if (inode.inodeId === ORG_ROOT_ID) {
    invariant(
      inode.type === 'folder',
      `Org folder erroneously set as ${inode.type}`
    );
    return 'folder-org';
  }

  switch (inode.type) {
    case 'worksheet':
      return 'worksheet-table';
    case 'dashboard':
      return 'dashboard';
    case 'folder':
    default:
      invariant(inode.type === 'folder', `Unknown inode type: ${inode.type}`);
      // XXX JDF: handle privacy?
      return 'folder-private';
  }
}

// sort files by type, and then by timestamp (desc)
export function sortFilesByType(a: InodeSummaryTy, b: InodeSummaryTy): number {
  // folders are ordered by name
  if (a.type === 'folder' || b.type === 'folder') {
    if (a.type === b.type) {
      return cmp(a.name, b.name, true);
    } else if (a.type === 'folder') {
      return -1;
    } else {
      invariant(b.type === 'folder', "expected type to be 'folder'");
      return 1;
    }
  }

  // non-folders are ordered by updated at (with name as the tie breaker)
  const timeSort = cmp(a.updatedAt, b.updatedAt, false);
  if (timeSort !== 0) {
    return timeSort;
  }

  return cmp(a.name, b.name, true);
}

// (max) see https://github.com/facebook/flow/issues/388
function cmp(a: any, b: any, asc: boolean): number {
  const cmp = a < b ? -1 : a > b ? 1 : 0;
  return asc ? cmp : -1 * cmp;
}



// WEBPACK FOOTER //
// ./src/utils/folders.js