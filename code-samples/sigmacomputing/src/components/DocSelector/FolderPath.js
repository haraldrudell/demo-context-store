// @flow
import React, { Component } from 'react';

import { Icon, Flex, Text } from 'widgets';
import { ORG_ROOT_ID } from 'api/organization';
import type { FolderDetailsTy, Id } from 'types';

type Props = {
  folder: FolderDetailsTy,
  onClickFolder: Id => void
};

export default class FolderPath extends Component<Props> {
  changeDir = (evt: SyntheticMouseEvent<HTMLElement>) => {
    const id = evt.currentTarget.dataset.id;
    this.props.onClickFolder(id);
  };

  render() {
    const { folder } = this.props;

    if (!folder.parent && folder.inodeId !== ORG_ROOT_ID) {
      return (
        <Flex justify="center" font="header5">
          Home
        </Flex>
      );
    }

    const backId = folder.parent ? folder.parent.inodeId : null;

    return (
      <Flex>
        <Flex
          data-id={backId}
          onClick={this.changeDir}
          mr={2}
          align="center"
          color="blue"
          css={`cursor: pointer;`}
          font="bodyMedium"
        >
          <Icon type="caret-left" size="10px" mr={1} />Back
        </Flex>
        <Flex flexGrow justify="center">
          <Text truncate font="header5">
            {folder.name}
          </Text>
        </Flex>
        <Flex opacity={0} align="center">
          <Icon type="caret-left" size="10px" mr={1} />Back
        </Flex>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DocSelector/FolderPath.js