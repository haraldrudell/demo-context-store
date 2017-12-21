// @flow
import React, { PureComponent } from 'react';
import type { Query } from '@sigmacomputing/sling';
import { AutoSizer } from 'react-virtualized';
import { css } from 'emotion';

import { Box, Button, Flex, IconButton, Text } from 'widgets';
import type { DbConnectionType, Id } from 'types';
import type { QuerySource } from 'types/workbook';
import type { TableObject } from 'types/table';
import PreviewIcon from 'icons/PreviewTable.svg';
import { evalQuery } from 'utils/apiCaller';
import DataSourceFetcher from 'components/DataSource/DataSourceFetcher';
import SourceSelector from 'components/DataSource/SourceSelector';
import TableForm from 'components/DataSource/TableForm';
import SqlForm from 'components/DataSource/SqlForm';
import WorksheetForm from 'components/DataSource/WorksheetForm';
import RowCountFetcher from 'components/RowCount';
import DataPreview, { ROW_LIMIT } from 'components/DataSource/DataPreview';
import Fetcher from 'components/Fetcher';
import colors from 'styles/colors';

const footerStyles = css`
  border-top: 1px solid ${colors.darkBlue5};
  background-color: ${colors.darkBlue6};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`;

type Props = {
  header: string,
  onClose?: () => void,
  onApply: () => void,

  hasNext?: boolean,

  workbookId?: Id,
  onSelectWorksheet: Id => Promise<*>,

  onSetSql: string => Promise<*>,

  error: string,
  listError: string,
  fetchError: string,

  data: ?{ table: Object },
  isLoading: boolean,

  deletedColumns: { [key: string]: boolean },
  query: ?Query,
  toggleColumn: (Array<string>) => void,

  listResult: ?Array<?Array<TableObject>>,
  scopes: Array<string>,
  selectedScope: Array<string>, // database / schema etc selected by the user
  setSelectedScope: (Array<string>) => void,

  selectedConnection: ?{ id: Id, label: string },
  connections: { [string]: DbConnectionType },
  selectConnection?: Id => void,

  source: QuerySource,
  setSource: QuerySource => void
};

type State = {
  currentStep: number
};

export class DataSource extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentStep: 0
    };
  }

  onBack = () => {
    this.setState({
      currentStep: this.state.currentStep - 1
    });
  };

  onNext = () => {
    this.setState({
      currentStep: this.state.currentStep + 1
    });
  };

  renderError() {
    const { fetchError, error, listError } = this.props;
    const { currentStep } = this.state;

    if (currentStep !== 0 && (fetchError || error || listError)) {
      return (
        <Text color="red" font="header4">
          {fetchError || error || listError}
        </Text>
      );
    }
  }

  renderSourceSelection() {
    const { source, onSetSql, setSource } = this.props;

    return (
      <SourceSelector
        source={source}
        setSource={setSource}
        onNext={this.onNext}
        allowSQL={Boolean(onSetSql)}
      />
    );
  }

  renderContent() {
    const { source } = this.props;

    if (source === 'table') {
      const {
        connections,
        selectConnection,
        selectedConnection,
        listResult,
        query,
        deletedColumns,
        toggleColumn,
        scopes,
        selectedScope,
        setSelectedScope
      } = this.props;
      return (
        <TableForm
          query={query}
          deletedColumns={deletedColumns}
          toggleColumn={toggleColumn}
          listResult={listResult}
          scopes={scopes}
          selectedScope={selectedScope}
          setSelectedScope={setSelectedScope}
          connections={connections}
          selectConnection={selectConnection}
          selectedConnection={selectedConnection}
        />
      );
    } else if (source === 'sql') {
      const {
        connections,
        selectConnection,
        selectedConnection,
        listResult,
        scopes,
        selectedScope,
        setSelectedScope,
        onSetSql
      } = this.props;
      return (
        <SqlForm
          onSetSql={onSetSql}
          listResult={listResult}
          scopes={scopes}
          selectedScope={selectedScope}
          setSelectedScope={setSelectedScope}
          connections={connections}
          selectConnection={selectConnection}
          selectedConnection={selectedConnection}
        />
      );
    } else if (source === 'query') {
      const {
        query,
        deletedColumns,
        toggleColumn,
        onSelectWorksheet
      } = this.props;
      return (
        <WorksheetForm
          onSelectWorksheet={onSelectWorksheet}
          query={query}
          deletedColumns={deletedColumns}
          toggleColumn={toggleColumn}
        />
      );
    }
  }

  renderPreview() {
    const { currentStep } = this.state;

    if (currentStep !== 0) {
      const {
        query,
        deletedColumns,
        isLoading,
        data,
        selectedConnection
      } = this.props;
      return (
        <Box mt={3}>
          <Flex align="center" mb={2} justify="space-between">
            <Flex align="center">
              <img alt="preview" src={PreviewIcon} />
              <Text font="header4">Preview</Text>
            </Flex>
            {query &&
              selectedConnection && (
                <RowCountFetcher
                  query={query}
                  connectionId={selectedConnection.id}
                />
              )}
          </Flex>
          <AutoSizer disableHeight>
            {({ width }) => (
              <DataPreview
                deletedColumns={deletedColumns}
                query={query}
                width={width}
                isLoading={isLoading}
                data={data}
              />
            )}
          </AutoSizer>
        </Box>
      );
    }
  }

  renderFooter() {
    const { currentStep } = this.state;
    const { onClose } = this.props;

    if (currentStep === 0) {
      return (
        <Flex
          justify="flex-end"
          align="center"
          py={2}
          px={4}
          className={footerStyles}
        >
          {onClose && (
            <Button type="secondary" mr={3} onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="primary" onClick={this.onNext}>
            Next
          </Button>
        </Flex>
      );
    } else {
      const { hasNext, query, onApply } = this.props;
      return (
        <Flex
          justify="space-between"
          align="center"
          py={2}
          px={4}
          bt={1}
          borderColor="darkBlue5"
          bg="darkBlue6"
          className={footerStyles}
        >
          <a onClick={this.onBack}>Back</a>
          <Box>
            {onClose && (
              <Button type="secondary" mr={3} onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="primary" disabled={!query} onClick={onApply}>
              {hasNext ? 'Next' : 'Done'}
            </Button>
          </Box>
        </Flex>
      );
    }
  }

  render() {
    const { header, onClose } = this.props;
    const { currentStep } = this.state;

    return (
      <Flex
        column
        width="600px"
        borderRadius="4px"
        bg="#ffffff"
        b={1}
        borderColor="darkBlue4"
        css={`
          box-shadow: 0 1px 4px 0 ${colors.darkBlue4};
        `}
      >
        <Flex
          bb={1}
          borderColor="darkBlue5"
          justify="space-between"
          py={3}
          px={4}
        >
          <Text font="header3">{header}</Text>
          {onClose && <IconButton onClick={onClose} type="close" />}
        </Flex>
        <div css={`max-height: 75vh; overflow-y: auto; overflow-x: hidden;`}>
          {currentStep === 0 && (
            <Flex p={4}>{this.renderSourceSelection()}</Flex>
          )}
          {currentStep !== 0 && (
            <Flex column px={4} py={2}>
              {this.renderError()}
              {this.renderContent()}
              {this.renderPreview()}
            </Flex>
          )}
        </div>
        {this.renderFooter()}
      </Flex>
    );
  }
}

function fetch(props: Props) {
  const { query, selectedConnection } = props;
  const OFFSET = 0;
  const ANCHOR = null;

  if (query && selectedConnection) {
    return evalQuery(query, OFFSET, ROW_LIMIT, ANCHOR, selectedConnection.id);
  } else {
    return Promise.resolve();
  }
}

function needsFetch(nextProps: Props, currentProps: Props) {
  return nextProps.query !== currentProps.query;
}

export default Fetcher(DataSourceFetcher(DataSource), fetch, needsFetch);



// WEBPACK FOOTER //
// ./src/components/DataSource/index.js