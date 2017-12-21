// @flow
import * as React from 'react';

import { Box, IconButton, Flex, Popup } from 'widgets';
// import ShareFetcher from 'components/SharePopover';
import type { FolderSummaryTy } from 'types';
import DocTitle from './DocTitle';

export default class Header extends React.PureComponent<{
  title: string,
  folder: FolderSummaryTy,
  actions: React.Element<*>,
  menu: React.Element<*>,
  onRename: string => void
}> {
  // renderSharePopover() {
  //   const { users } = this.props;
  //   return (
  //     <ShareFetcher
  //       sharedUsers={users}
  //       onSendInvites={this.props.onSendInvites}
  //     />
  //   );
  // }

  render() {
    const { actions, menu, folder, onRename, title } = this.props;

    return (
      <Flex
        width="100%"
        px={3}
        bb={1}
        borderColor="darkBlue4"
        bg="white"
        align="center"
        css={`position: absolute; top: 0; height: 56px;`}
      >
        <DocTitle folder={folder} onRename={onRename} title={title} />
        <div className="flex-item" />
        {actions}
        {/*<Popover
          overlayClassName={styles.sharePopover}
          content={this.renderSharePopover()}
          placement="bottomRight"
          trigger="click"
        >
          <Button font="header5" ml={3} type="secondary">
            Invite
          </Button>
        </Popover>*/}
        <Box bl={1} borderColor="darkBlue4" mx={3} css={`height: 28px;`} />
        <Popup popupPlacement="bottom-end" target={<IconButton type="more" />}>
          {menu}
        </Popup>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/nav/Header.js