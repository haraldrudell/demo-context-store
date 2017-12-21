// @flow
import * as React from 'react';
import type { ValueType, ColumnId, Column, Id } from '@sigmacomputing/sling';

import { Box, Flex } from 'widgets';
import Chart from 'utils/chart/Chart';
import ChartFormat from './format/ChartFormat';
import ChartEditor from './customize/ChartEditor';

const Tab = ({
  isActive,
  title,
  onClick
}: {
  isActive: boolean,
  title: string,
  onClick: () => void
}) => (
  <Box
    bb={4}
    borderColor={isActive ? 'blue' : 'transparent'}
    color={isActive ? 'blue' : 'darkBlue2'}
    px={2}
    py={2}
    onClick={onClick}
    hoverColor="blue"
    css={`cursor: pointer;}`}
    font="header5"
  >
    {title}
  </Box>
);

type Props = {
  labels: { [string]: string },
  columns: { [ColumnId]: Column },
  types: { [string]: ?ValueType },
  setChart: Chart => void,
  chart: Chart,
  layerId: Id,
  setLayerId: Id => void
};

export default class ChartInspector extends React.Component<
  Props,
  {
    activeTab: 'format' | 'customize'
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activeTab: 'format'
    };
  }

  setFormatEditor = () => {
    this.setState({
      activeTab: 'format'
    });
  };

  setCustomizeEditor = () => {
    this.setState({
      activeTab: 'customize'
    });
  };

  render() {
    const {
      labels,
      columns,
      types,
      setChart,
      chart,
      layerId,
      setLayerId
    } = this.props;
    const { activeTab } = this.state;

    return (
      <Flex column bl={1} borderColor="darkBlue4" width="250px">
        <Flex
          justify="space-between"
          width="100%"
          pt={1}
          px={4}
          bb={1}
          borderColor="darkBlue4"
        >
          <Tab
            title="Format"
            isActive={activeTab === 'format'}
            onClick={this.setFormatEditor}
          />
          <Tab
            title="Customize"
            isActive={activeTab === 'customize'}
            onClick={this.setCustomizeEditor}
          />
        </Flex>
        <Box flexGrow css={`overflow-y: auto;`}>
          {activeTab === 'format' ? (
            <ChartFormat
              labels={labels}
              columns={columns}
              types={types}
              setChart={setChart}
              chart={chart}
              layerId={layerId}
              setLayerId={setLayerId}
            />
          ) : (
            <ChartEditor chart={chart} onUpdate={setChart} />
          )}
        </Box>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ChartInspector/index.js