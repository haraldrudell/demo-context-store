// @flow

import gql from 'graphql-tag';
import { Query } from '@sigmacomputing/sling';
import invariant from 'invariant';

import type { FolderSummaryTy, Id, DbConnectionType } from 'types';
import type { WorkbookMeta } from 'types/workbook';
import Chart from 'utils/chart/Chart';
import { decodeChart, serializeForStorage } from 'utils/chart/storage';
import { getCurrentUserId } from 'utils/auth';
import { publish } from 'utils/events';

import { getApiClient } from './client';
import { ConnectionFragment, mapConnection } from './connection';
import {
  addInodeToFolder,
  InodeSummaryFragment,
  mapInodeSummary,
  purgeInodeFromFolder
} from './organization';

export function createWorkbook(
  { title, connectionId }: WorkbookMeta,
  query: Query,
  folderId?: Id,
  charts?: { [Id]: Chart } = {}
): Promise<Id> {
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation CreateWorksheet($req: CreateWorksheetReq!) {
          createWorksheet(req: $req) {
            worksheet {
              ...InodeSummaryFragment
              parent {
                inodeId
              }
            }
          }
        }
        ${InodeSummaryFragment}
      `,
      variables: {
        req: {
          parentInodeId: folderId,
          name: title,
          connectionId,
          draft: {
            query: query.serializeForStorage(),
            charts: encodeCharts(charts)
          }
        }
      },
      update: (store, { data: { createWorksheet: { worksheet } } }) =>
        addInodeToFolder(store, worksheet.parent.inodeId, worksheet)
    })
    .then(({ data: { createWorksheet: { worksheet } } }) => {
      publish('CreateWorkbook', { connectionId });
      return worksheet.inodeId;
    });
}

export function renameWorkbook(
  worksheetId: string,
  title: string
): Promise<void> {
  return getApiClient().mutate({
    mutation: gql`
      mutation RenameWorksheet($req: UpdateWorksheetReq!) {
        updateWorksheet(req: $req) {
          worksheet {
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
        inodeId: worksheetId,
        name: title
      }
    }
  });
}

export function deleteWorkbook(parentId: Id, worksheetId: Id): Promise<void> {
  return getApiClient().mutate({
    mutation: gql`
      mutation DeleteWorksheet($req: ArchiveWorksheetReq!) {
        archiveWorksheet(req: $req) {
          success
        }
      }
    `,
    variables: {
      req: { inodeId: worksheetId }
    },
    update: store => purgeInodeFromFolder(store, parentId, worksheetId)
  });
}

export const WorksheetFragment = gql`
  fragment WorksheetFragment on Worksheet {
    inodeId
    name
    parent {
      ...InodeSummaryFragment
    }
    createdBy {
      userId
    }
    currentDraft
    connection {
      ...ConnectionFragment
    }
  }
  ${InodeSummaryFragment}
  ${ConnectionFragment}
`;

export type WorksheetTy = {|
  inodeId: Id,
  title: string,
  folder: FolderSummaryTy,
  canEdit: boolean,
  connection: DbConnectionType,
  query: Query,
  charts: { [Id]: Chart }
|};

export function mapWorksheet({
  inodeId,
  name,
  parent,
  createdBy,
  currentDraft,
  connection
}: {
  inodeId: string,
  name: string,
  parent: Object,
  createdBy: {
    userId: string
  },
  currentDraft: {
    charts?: Object,
    query: string
  },
  connection: Object
}): WorksheetTy {
  let parsedCharts = {};
  if (currentDraft.charts) {
    for (const id of Object.keys(currentDraft.charts)) {
      parsedCharts[id] = decodeChart(currentDraft.charts[id].chart);
    }
  }

  const folder = mapInodeSummary(parent);
  invariant(folder.type === 'folder', `Expected folder, found ${folder.type}`);

  return {
    inodeId,
    title: name,
    folder,
    canEdit: getCurrentUserId() === createdBy.userId,
    connection: mapConnection(connection),
    query: Query.parse(currentDraft.query),
    charts: parsedCharts
  };
}

export function loadWorkbook(worksheetId: Id): Promise<WorksheetTy> {
  return getApiClient()
    .query({
      query: gql`
        query GetWorksheet($worksheetId: UUID!) {
          organization {
            worksheet(id: $worksheetId) {
              ...WorksheetFragment
            }
          }
        }
        ${WorksheetFragment}
      `,
      variables: { worksheetId }
    })
    .then(({ data }) => {
      const { worksheet } = data.organization;
      if (!worksheet) return Promise.reject({ notFound: true });

      return mapWorksheet(worksheet);
    });
}

function encodeCharts(charts: { [Id]: Chart }) {
  const encodedCharts = {};
  for (const id of Object.keys(charts)) {
    encodedCharts[id] = {
      chart: serializeForStorage(charts[id])
    };
  }
  return encodedCharts;
}

export function updateWorksheet(
  worksheetId: Id,
  query: Query,
  charts: { [Id]: Chart }
): Promise<void> {
  const draft = {
    query: query.serializeForStorage(),
    charts: encodeCharts(charts)
  };

  return getApiClient().mutate({
    mutation: gql`
      mutation UpdateWorksheet($req: UpdateWorksheetReq!) {
        updateWorksheet(req: $req) {
          worksheet {
            inodeId
            updatedAt
          }
        }
      }
    `,
    variables: {
      req: {
        inodeId: worksheetId,
        draft
      }
    },
    update: (store, { data: { updateWorksheet } }) => {
      const data = store.readFragment({
        id: worksheetId,
        fragment: WorksheetFragment,
        fragmentName: 'WorksheetFragment'
      });

      store.writeFragment({
        id: worksheetId,
        fragment: WorksheetFragment,
        fragmentName: 'WorksheetFragment',
        data: {
          ...data,
          updatedAt: updateWorksheet.worksheet.updatedAt,
          currentDraft: draft
        }
      });
    }
  });
}

export function shareWorksheet(/*wsId: Id, users: Array<User>*/): Promise<
  void
> {
  // XXX JDF: NYI against crossover
  return Promise.resolve();
}



// WEBPACK FOOTER //
// ./src/api/workbook.js