// @flow
import React, { Component } from 'react';
import invariant from 'invariant';

import DocSelector from 'containers/Library/DocSelector';
import { Box, Button, Flex, Modal, Text } from 'widgets';
import type { InodeSummaryTy } from 'types';
import ChartList from './ChartList';

type Props = {
  onAddCharts: (string, Array<string>) => void,
  onClose: () => void
};
export default class DashboardModal extends Component<
  Props,
  {
    selectedWorksheet: ?string,
    selectedCharts: { [chartId: string]: boolean }
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedWorksheet: null,
      selectedCharts: {}
    };
  }

  canSelectDoc = (doc: InodeSummaryTy) => {
    invariant(
      doc.type !== 'worksheet' || doc.hasCharts != null,
      'Missing hasCharts field'
    );
    return doc.type === 'worksheet' && doc.hasCharts === true;
  };

  onSelectWorksheet = (doc: ?InodeSummaryTy) => {
    const worksheetId = doc ? doc.inodeId : null;
    this.setState({
      selectedWorksheet: worksheetId,
      selectedCharts: {}
    });
  };

  onToggleChart = (chartId: string) => {
    const { selectedCharts } = this.state;
    const newSelected = {
      ...selectedCharts,
      [chartId]: !selectedCharts[chartId]
    };
    this.setState({
      selectedCharts: newSelected
    });
  };

  onAddCharts = () => {
    const { selectedWorksheet, selectedCharts } = this.state;
    invariant(selectedWorksheet, 'selectedWorksheet should not be null');
    const charts = Object.keys(selectedCharts).filter(
      chartId => selectedCharts[chartId]
    );

    this.props.onAddCharts(selectedWorksheet, charts);
  };

  renderFooter() {
    const { onClose } = this.props;
    const { selectedCharts } = this.state;
    const charts = Object.keys(selectedCharts).filter(
      chartId => selectedCharts[chartId]
    );
    return [
      <Button key="cancel" type="secondary" onClick={onClose}>
        Cancel
      </Button>,
      <Button
        key="confirm"
        disabled={charts.length === 0}
        type="primary"
        onClick={this.onAddCharts}
      >
        Apply
      </Button>
    ];
  }

  render() {
    const { onClose } = this.props;
    const { selectedWorksheet, selectedCharts } = this.state;

    return (
      <Modal
        visible
        width={580}
        title={
          <Text ml={2} font="header3">
            Insert a Chart
          </Text>
        }
        footer={this.renderFooter()}
        onClose={onClose}
      >
        <Box p={2}>
          <Text font="bodyMedium">
            Select a worksheet that contains the chart you&apos;d like to insert
            into your dashboard.
          </Text>
          <Flex mt={3} b={1} borderColor="darkBlue4">
            <DocSelector
              css={`height: 400px;`}
              canSelectDoc={this.canSelectDoc}
              fetchChartInfo={true}
              initialFolderId={null}
              onSelectDoc={this.onSelectWorksheet}
            />
            <Box
              bl={1}
              borderColor="darkBlue4"
              flexGrow
              py={3}
              css={`height: 400px; overflow-y: auto;`}
            >
              <ChartList
                selectedWorksheet={selectedWorksheet}
                selectedCharts={selectedCharts}
                onToggleChart={this.onToggleChart}
              />
            </Box>
          </Flex>
        </Box>
      </Modal>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DashboardModal/index.js