// @flow

import * as React from 'react';

import MoveInode from 'components/library/MoveInode';
import { moveInode } from 'api/organization';
import { Modal } from 'widgets';
import type { Id } from 'types';

import FolderView from './FolderView';

type Props = {|
  currentFolderId: Id,
  inodeId: Id,
  onClose: () => void
|};

export default class MoveModal extends React.Component<Props> {
  handleAccept = (destFolderId: Id) => {
    const { currentFolderId, inodeId, onClose } = this.props;

    moveInode(currentFolderId, inodeId, destFolderId);

    onClose();
  };

  render() {
    const { currentFolderId, inodeId, onClose } = this.props;

    return (
      <Modal
        css={`
          & .ant-modal-body {
            padding: 0;
            font-size: inherit;
            line-height: inherit;
          }
        `}
        closable={false}
        footer={null}
        onClose={onClose}
        width={438}
        visible
      >
        <FolderView initialFolderId={currentFolderId}>
          {(_, folder, onSelectFolder) => (
            <MoveInode
              folder={folder}
              inodeId={inodeId}
              onAccept={this.handleAccept}
              onCancel={onClose}
              onSelectFolder={onSelectFolder}
            />
          )}
        </FolderView>
      </Modal>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Library/MoveModal.js