// @flow

import * as React from 'react';
import Helmet from 'react-helmet';
import type { Location, Match, RouterHistory } from 'react-router-dom';
import invariant from 'invariant';

import MoveModal from 'containers/Library/MoveModal';
import RenameModal from 'components/RenameModal';
import FolderBrowseList from 'components/library/FolderBrowseList';
import FolderActionPanel from 'components/library/FolderActionPanel';
import FolderPath from 'components/library/FolderPath';
import { Flex, Text } from 'widgets';
import {
  createDashboard,
  deleteDashboard,
  updateTitle as renameDashboard
} from 'api/dashboard';
import { createFolder, deleteFolder, renameFolder } from 'api/organization';
import { deleteWorkbook, renameWorkbook } from 'api/workbook';
import { captureException } from 'utils/errors';
import { decodeFolderUrl, encodeDashboardUrl } from 'utils/url';
import type { FolderDetailsTy, InodeSummaryTy } from 'types';

import { FolderFetcher } from './FolderView';
import LibraryHeader from './LibraryHeader';
import NavigationPanel from './NavigationPanel';

type Props = {|
  folder: ?FolderDetailsTy,
  history: RouterHistory,
  pathname: string
|};

type ModalState =
  | {| type: 'createFolder' |}
  | {| type: 'move', inode: InodeSummaryTy |}
  | {| type: 'rename', inode: InodeSummaryTy |};

type State = {|
  modalState: ?ModalState
|};

class Library extends React.Component<Props, State> {
  state = {
    modalState: null
  };

  hideModal = () => {
    this.setState({ modalState: null });
  };

  handleRename = (newName: string) => {
    const { modalState } = this.state;
    invariant(
      modalState != null && modalState.type === 'rename',
      'Rename invoked without state'
    );
    const { inode } = modalState;

    if (inode.name !== newName) {
      if (inode.type === 'folder') {
        renameFolder(inode.inodeId, newName);
      } else if (inode.type === 'worksheet') {
        renameWorkbook(inode.inodeId, newName);
      } else if (inode.type === 'dashboard') {
        renameDashboard(inode.inodeId, newName);
      }
    }

    this.hideModal();
  };

  showModal(modalState: ModalState) {
    this.setState({ modalState });
  }

  handleDeleteInode = (inode: InodeSummaryTy) => {
    const { folder } = this.props;
    invariant(folder != null, 'Must have current folder');

    if (inode.type === 'folder') {
      deleteFolder(folder.inodeId, inode.inodeId);
    } else if (inode.type === 'worksheet') {
      deleteWorkbook(folder.inodeId, inode.inodeId);
    } else if (inode.type === 'dashboard') {
      deleteDashboard(folder.inodeId, inode.inodeId);
    }
  };

  showMoveInode = (inode: InodeSummaryTy) => {
    this.showModal({ type: 'move', inode });
  };

  showRenameInode = (inode: InodeSummaryTy) => {
    this.showModal({ type: 'rename', inode });
  };

  handleCreateDashboard = () => {
    const { folder } = this.props;
    invariant(folder != null, 'Must have current folder');

    const title = 'Untitled';
    createDashboard(title, folder.inodeId)
      .then(id => {
        this.props.history.push(encodeDashboardUrl(id, title));
      })
      .catch(captureException);
  };

  handleCreateFolder = (name: string) => {
    const { folder } = this.props;
    invariant(folder != null, 'Must have current folder');

    createFolder(name, folder.inodeId);
    this.hideModal();
  };

  showCreateFolder = () => {
    this.showModal({ type: 'createFolder' });
  };

  showRenameCurrentFolder = () => {
    const { folder } = this.props;
    invariant(folder != null, 'Must have current folder');

    // Work around Flow types...
    const { inodeId, name, updatedBy, updatedAt, type } = folder;
    const inode = { inodeId, name, updatedBy, updatedAt, type };

    this.showModal({ type: 'rename', inode });
  };

  renderModals() {
    const { modalState } = this.state;
    if (!modalState) return null;

    const { folder } = this.props;
    invariant(folder != null, 'Modal state invalid without folder');

    if (modalState.type === 'createFolder') {
      return (
        <RenameModal
          description="Create Folder"
          initialName="New Folder"
          onClose={this.hideModal}
          onRename={this.handleCreateFolder}
        />
      );
    } else if (modalState.type === 'move') {
      const { inode } = modalState;
      return (
        <MoveModal
          currentFolderId={folder.inodeId}
          inodeId={inode.inodeId}
          onClose={this.hideModal}
        />
      );
    } else if (modalState.type === 'rename') {
      const { inode } = modalState;
      return (
        <RenameModal
          description={`Rename ${inode.type}`}
          initialName={inode.name}
          onClose={this.hideModal}
          onRename={this.handleRename}
        />
      );
    }
  }

  render() {
    const { pathname, folder } = this.props;

    // opens help when user is home and has no private files or folders
    const openHelp =
      folder != null &&
      folder.children.length < 2 &&
      (!pathname || pathname === '/');

    return (
      <Flex css={`height: 100vh;`} column>
        <Helmet title="Worksheets - Sigma" />
        <LibraryHeader openHelp={openHelp} />
        <Flex bg="darkBlue6" flexGrow pt={4}>
          <NavigationPanel pathname={pathname} />
          <Flex flexGrow px={4}>
            <Flex column flexGrow>
              <Text font="header2" mb={3}>
                <FolderPath folder={folder} />
              </Text>
              <FolderBrowseList
                contents={folder ? folder.children : null}
                onDelete={this.handleDeleteInode}
                onMove={this.showMoveInode}
                onRename={this.showRenameInode}
              />
            </Flex>
            <FolderActionPanel
              folder={folder}
              onCreateDashboard={this.handleCreateDashboard}
              onCreateFolder={this.showCreateFolder}
              onRenameFolder={this.showRenameCurrentFolder}
            />
          </Flex>
        </Flex>
        {this.renderModals()}
      </Flex>
    );
  }
}

type ContainerProps = {|
  history: RouterHistory,
  location: Location,
  match: Match
|};

function getFolderId(pathname: string, match: Match): ?string {
  if (pathname === '/') return null;
  // if (pathname === '/recent') return 'recent';
  // if (pathname === '/ws/shared') return 'shared';
  return decodeFolderUrl(match.url);
}

export default function LibraryContainer(props: ContainerProps) {
  const { history, location: { pathname }, match } = props;
  const folderId = getFolderId(pathname, match);

  return (
    <FolderFetcher folderId={folderId}>
      {(_, folder) => (
        <Library folder={folder} history={history} pathname={pathname} />
      )}
    </FolderFetcher>
  );
}



// WEBPACK FOOTER //
// ./src/containers/Library/Library.js