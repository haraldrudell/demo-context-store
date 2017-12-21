// @flow

import gql from 'graphql-tag';
import invariant from 'invariant';

import type { FolderPathType, Id, InodeSummaryTy, User } from 'types';
import { getCurrentUserId } from 'utils/auth';
import { OrgMemberFragment, getUserInfo, mapMemberToUser } from './user';
import { getApiClient } from './client';

export const ORG_ROOT_ID = '00000000-0000-0000-0000-000000000000';

let homeInodeId = null;

// only exposed for tests
export function setHomeInodeId(inodeId: ?string) {
  homeInodeId = inodeId;
}

export function getHomeInodeId(): string {
  invariant(homeInodeId != null, 'Home Inode Id not set!');
  return homeInodeId;
}

export function getOrganizationId(): Promise<string> {
  return getApiClient()
    .query({
      query: gql`
        query GetOrganizationId {
          identity {
            organizations
          }
        }
      `
    })
    .then(({ data }) => data.identity.organizations[0]);
}

export function initHomeInode(): Promise<void> {
  return getApiClient()
    .query({
      query: gql`
        query GetHomeInode {
          organization {
            me {
              home {
                inodeId
              }
            }
          }
        }
      `
    })
    .then(({ data: { organization } }) => {
      homeInodeId = organization.me.home.inodeId;
    });
}

export function mapInodeSummary(inodeObj: Object): InodeSummaryTy {
  const { inodeId, name, updatedBy, updatedAt, __typename } = inodeObj;

  const base = {
    inodeId,
    name: inodeId === getHomeInodeId() ? 'Home' : name,
    updatedBy: updatedBy.name,
    updatedAt: new Date(updatedAt)
  };
  const canEdit = getCurrentUserId() === updatedBy.userId;

  switch (__typename) {
    case 'Worksheet':
      return {
        ...base,
        type: 'worksheet',
        canEdit,
        hasCharts:
          inodeObj.currentDraft != null
            ? Object.keys(inodeObj.currentDraft.charts).length > 0
            : undefined
      };
    case 'Dashboard':
      return {
        ...base,
        type: 'dashboard',
        canEdit
      };
    default:
      invariant(
        __typename === 'Folder',
        `Unexpected inode type: ${__typename}`
      );
      return {
        ...base,
        type: 'folder'
      };
  }
}

export const InodeSummaryFragment = gql`
  fragment InodeSummaryFragment on Inode {
    inodeId
    name
    updatedBy {
      userId
      name
    }
    updatedAt
  }
`;

export const FolderDetailsFragment = gql`
  fragment FolderDetailsFragment on Folder {
    ...InodeSummaryFragment
    parent {
      ...InodeSummaryFragment
    }
    children {
      ...InodeSummaryFragment
    }
  }
  ${InodeSummaryFragment}
`;

export function getFolderPath(folderId: string): Promise<FolderPathType> {
  return getApiClient()
    .query({
      query: gql`
        query GetFolderPath($folderId: UUID!) {
          organization {
            folder(id: $folderId) {
              inodeId
              name
              parentPath {
                inodeId
                name
              }
            }
          }
        }
      `,
      variables: { folderId }
    })
    .then(({ data }) => {
      const { folder } = data.organization;
      const path = [{ label: folder.name, id: folder.inodeId }].concat(
        folder.parentPath.map(({ inodeId, name }) => ({
          label: name,
          id: inodeId
        }))
      );
      path.reverse();

      // XXX JDF: The rest of the front-end currently is very gung ho on
      // treating the home folder as null in various ways. Accordingly, remove
      // it from the path here.
      if (path.length > 0 && path[0].id !== ORG_ROOT_ID) path.shift();

      return path;
    });
}

export function createFolder(title: string, folderId: Id): Promise<Id> {
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation CreateFolder($req: CreateFolderReq!) {
          createFolder(req: $req) {
            folder {
              ...InodeSummaryFragment
            }
          }
        }
        ${InodeSummaryFragment}
      `,
      variables: {
        req: {
          parentInodeId: folderId,
          name: title
        }
      },
      update: (store, { data: { createFolder } }) =>
        addInodeToFolder(store, folderId, createFolder.folder)
    })
    .then(({ data }) => data.createFolder.folder.inodeId);
}

function updateFolderChildren(
  store: any,
  folderId: Id,
  update: (Array<any>) => Array<any>
) {
  const data = store.readFragment({
    id: folderId,
    fragment: FolderDetailsFragment,
    fragmentName: 'FolderDetailsFragment'
  });

  const children = update(data.children);

  store.writeFragment({
    id: folderId,
    fragmentName: 'FolderDetailsFragment',
    fragment: FolderDetailsFragment,
    data: {
      ...data,
      children
    }
  });
}

export function addInodeToFolder(
  store: any,
  folderId: Id,
  childSummary: Object
) {
  updateFolderChildren(store, folderId, children =>
    children.concat(childSummary)
  );
}

export function purgeInodeFromFolder(store: any, folderId: Id, childId: Id) {
  updateFolderChildren(store, folderId, children =>
    children.filter(child => child.inodeId !== childId)
  );
}

export function deleteFolder(parentId: Id, folderId: Id): Promise<void> {
  return getApiClient().mutate({
    mutation: gql`
      mutation DeleteFolder($req: ArchiveFolderReq!) {
        archiveFolder(req: $req) {
          success
        }
      }
    `,
    variables: {
      req: { inodeId: folderId }
    },
    update: store => purgeInodeFromFolder(store, parentId, folderId)
  });
}

export function renameFolder(folderId: Id, title: string): Promise<void> {
  return getApiClient().mutate({
    mutation: gql`
      mutation RenameFolder($req: UpdateFolderReq!) {
        updateFolder(req: $req) {
          folder {
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
        inodeId: folderId,
        name: title
      }
    }
  });
}

export function moveInode(
  sourceFolderInodeId: Id,
  targetInodeId: Id,
  destFolderInodeId: Id
): Promise<void> {
  return getApiClient().mutate({
    mutation: gql`
      mutation MoveInode($req: MoveInodeReq!) {
        moveInode(req: $req) {
          targetInode {
            inodeId
            updatedAt
          }
        }
      }
    `,
    variables: {
      req: { targetInodeId, destFolderInodeId }
    },
    update: store => {
      const sourceDetails = store.readFragment({
        id: sourceFolderInodeId,
        fragment: FolderDetailsFragment,
        fragmentName: 'FolderDetailsFragment'
      });
      const targetSummary = sourceDetails.children.find(
        child => child.inodeId === targetInodeId
      );
      invariant(
        targetSummary != null,
        `Couldn't find inode ${targetInodeId} in ${destFolderInodeId}`
      );

      purgeInodeFromFolder(store, sourceFolderInodeId, targetInodeId);
      addInodeToFolder(store, destFolderInodeId, targetSummary);
    }
  });
}

export function getOrgMembers(): Promise<Array<User>> {
  return getApiClient()
    .query({
      query: gql`
        query GetAllMembers {
          organization {
            members {
              ...OrgMemberFragment
            }
          }
        }
        ${OrgMemberFragment}
      `
    })
    .then(({ data }) => {
      const { members } = data.organization;
      return members.map(mapMemberToUser);
    });
}

export function isOrgAdmin(): Promise<boolean> {
  return getUserInfo().then(({ role }) => role === 'owner');
}

export function renameOrg(newName: string): Promise<string> {
  return updateOrganization(newName).then(({ name }) => name);
}

export type Organization_t = {|
  name: string
|};

export function updateOrganization(name: string): Promise<Organization_t> {
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation UpdateOrganization($req: UpdateOrganizationReq!) {
          updateOrganization(req: $req) {
            organization {
              name
            }
          }
        }
      `,
      variables: { req: { name } }
    })
    .then(({ data }) => {
      const { name } = data.updateOrganization.organization;
      return { name };
    });
}

export function createOrganization(name: string): Promise<string> {
  return getApiClient()
    .mutate({
      mutation: gql`
        mutation CreateOrganization($req: CreateOrganizationReq!) {
          createOrganization(req: $req) {
            organization {
              organizationId
            }
          }
        }
      `,
      variables: { req: { name } }
    })
    .then(({ data }) => data.createOrganization.organization.organizationId);
}



// WEBPACK FOOTER //
// ./src/api/organization.js