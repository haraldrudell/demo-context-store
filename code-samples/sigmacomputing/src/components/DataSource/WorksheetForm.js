// @flow
import React, { PureComponent } from 'react';
import type { Query } from '@sigmacomputing/sling';

import { Box, Flex, Text } from 'widgets';
import type { Id, InodeSummaryTy } from 'types';
import ColumnSelector from 'components/DataSource/ColumnSelector';
import DocSelector from 'containers/Library/DocSelector';

type Props = {
  onSelectWorksheet: Id => Promise<*>,
  query: ?Query,
  deletedColumns: { [key: string]: boolean },
  toggleColumn: (Array<string>) => void
};

export default class WorksheetForm extends PureComponent<
  Props,
  {
    isLoading: boolean
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  canSelectDoc = (doc: InodeSummaryTy) => {
    return doc.type === 'worksheet';
  };

  onSelectWorksheet = (doc: ?InodeSummaryTy) => {
    if (!doc) return;

    this.setState({
      isLoading: true
    });
    this.props.onSelectWorksheet(doc.inodeId).then(() => {
      this.setState({
        isLoading: false
      });
    });
  };

  render() {
    const { query, deletedColumns, toggleColumn } = this.props;

    return (
      <Box>
        <Text font="header4">
          Select the worksheet and columns to include in your worksheet
        </Text>
        <Flex mt={4}>
          <Box b={1} borderColor="darkBlue5" mr={3}>
            <DocSelector
              css={`
                width: 232px;
                height: 280px;
              `}
              canSelectDoc={this.canSelectDoc}
              fetchChartInfo={false}
              initialFolderId={null}
              onSelectDoc={this.onSelectWorksheet}
            />
          </Box>
          <ColumnSelector
            isLoading={this.state.isLoading}
            query={query}
            deletedColumns={deletedColumns}
            toggleColumn={toggleColumn}
          />
        </Flex>
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/WorksheetForm.js