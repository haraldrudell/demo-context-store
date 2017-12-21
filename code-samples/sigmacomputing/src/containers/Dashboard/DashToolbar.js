// @flow

import * as React from 'react';

import { Flex } from 'widgets';
import ToolbarButton from 'components/toolbar/ToolbarButton';

type Props = {
  onAddCharts: () => void,
  onAddText: () => void,
  onOpenRefreshModal: ?() => void
};

export default class DashToolbar extends React.Component<Props> {
  onOpenRefreshModal = () => {
    const { onOpenRefreshModal } = this.props;
    if (onOpenRefreshModal) {
      onOpenRefreshModal();
    }
  };

  render() {
    const { onAddCharts, onAddText, onOpenRefreshModal } = this.props;

    return (
      <Flex
        width="100%"
        bb={1}
        borderColor="darkBlue4"
        align="center"
        px={3}
        py={2}
        bg="white"
      >
        <ToolbarButton icon="plus" text="Add Charts" onClick={onAddCharts} />
        <ToolbarButton ml={4} icon="plus" text="Add Text" onClick={onAddText} />
        {onOpenRefreshModal && (
          <ToolbarButton
            ml={4}
            icon="spinner"
            text="Auto Refresh"
            onClick={this.onOpenRefreshModal}
          />
        )}
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/Dashboard/DashToolbar.js