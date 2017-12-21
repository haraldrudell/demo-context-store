// @flow

import gql from 'graphql-tag';
import invariant from 'invariant';

import type { DashboardDetailsTy, DashboardSettingsTy, Id } from 'types';
import type { DashboardTile } from 'containers/Dashboard';
import { publish } from 'utils/events';
import { getApiClient } from './client';
import {
  addInodeToFolder,
  InodeSummaryFragment,
  mapInodeSummary,
  purgeInodeFromFolder
} from './organization';

export function createDashboard(
  title: string = 'Untitled',
  folderId: Id
): Promise<Id> {
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation CreateDashboard($req: CreateDashboardReq!) {
          createDashboard(req: $req) {
            dashboard {
              ...InodeSummaryFragment
            }
          }
        }
        ${InodeSummaryFragment}
      `,
      variables: {
        req: {
          parentInodeId: folderId,
          name: title,
          draft: {
            tiles: {}
          }
        }
      },
      update: (store, { data: { createDashboard } }) =>
        addInodeToFolder(store, folderId, createDashboard.dashboard)
    })
    .then(({ data }) => {
      publish('CreateDashboard');
      return data.createDashboard.dashboard.inodeId;
    });
}

export const DashboardFragment = gql`
  fragment DashboardFragment on Dashboard {
    ...InodeSummaryFragment
    parent {
      ...InodeSummaryFragment
    }
    currentDraft
  }
  ${InodeSummaryFragment}
`;

export function mapDashboard(obj: Object): DashboardDetailsTy {
  const { parent, currentDraft } = obj;
  const base = mapInodeSummary(obj);
  const { inodeId, name, updatedBy, updatedAt } = base;
  invariant(
    base.type === 'dashboard',
    `Expected dashboard, found ${base.type}`
  );
  const folder = mapInodeSummary(parent);
  invariant(folder.type === 'folder', `Expected folder, found ${folder.type}`);
  return {
    inodeId,
    name,
    updatedBy,
    updatedAt,
    type: base.type,
    canEdit: base.canEdit,
    folder,
    tiles: currentDraft.tiles,
    settings: currentDraft.settings
  };
}

export function updateTitle(dashboardId: Id, title: string): Promise<void> {
  return getApiClient().mutate({
    mutation: gql`
      mutation RenameDashboard($req: UpdateDashboardReq!) {
        updateDashboard(req: $req) {
          dashboard {
            inodeId
            # We use the name to update our local state
            name
            updatedAt
          }
        }
      }
    `,
    variables: {
      req: {
        inodeId: dashboardId,
        name: title
      }
    }
  });
}

export function updateDashboardContent(
  dashboardId: Id,
  tiles: { [Id]: DashboardTile },
  settings: ?DashboardSettingsTy
): Promise<void> {
  const draft = { tiles, settings };

  return getApiClient().mutate({
    mutation: gql`
      mutation UpdateDashboard($req: UpdateDashboardReq!) {
        updateDashboard(req: $req) {
          dashboard {
            inodeId
            updatedAt
          }
        }
      }
    `,
    variables: {
      req: {
        inodeId: dashboardId,
        draft
      }
    },
    update: (store, { data: { updateDashboard } }) => {
      const data = store.readFragment({
        id: dashboardId,
        fragment: DashboardFragment,
        fragmentName: 'DashboardFragment'
      });

      store.writeFragment({
        id: dashboardId,
        fragment: DashboardFragment,
        fragmentName: 'DashboardFragment',
        data: {
          ...data,
          updatedAt: updateDashboard.dashboard.updatedAt,
          currentDraft: draft
        }
      });
    }
  });
}

export function deleteDashboard(parentId: Id, dashboardId: Id): Promise<void> {
  return getApiClient().mutate({
    mutation: gql`
      mutation ArchiveDashboard($req: ArchiveDashboardReq!) {
        archiveDashboard(req: $req) {
          success
        }
      }
    `,
    variables: {
      req: { inodeId: dashboardId }
    },
    update: store => purgeInodeFromFolder(store, parentId, dashboardId)
  });
}



// WEBPACK FOOTER //
// ./src/api/dashboard.js