// @flow
import React, { PureComponent } from 'react';
import type { Query } from '@sigmacomputing/sling';

import { Flex, Text } from 'widgets';
import type { TableObject } from 'types/table';
import type { DbConnectionType, Id } from 'types';
import ConnectionSelector from 'components/DataSource/ConnectionSelector';
import ScopeSelector from 'components/DataSource/ScopeSelector';
import ColumnSelector from 'components/DataSource/ColumnSelector';

export default class TableForm extends PureComponent<{
  listResult: ?Array<?Array<TableObject>>,
  selectedScope: Array<string>, // database / schema etc selected by the user
  setSelectedScope: (Array<string>) => void,
  scopes: Array<string>,
  query: ?Query,
  deletedColumns: { [key: string]: boolean },
  toggleColumn: (Array<string>) => void,
  connections: { [string]: DbConnectionType },
  selectConnection?: Id => void,
  selectedConnection: ?{ id: Id, label: string }
}> {
  render() {
    const {
      query,
      deletedColumns,
      toggleColumn,
      connections,
      selectConnection,
      selectedConnection,
      listResult,
      scopes,
      selectedScope,
      setSelectedScope
    } = this.props;

    return (
      <Flex column flexGrow>
        <Text font="header4">
          Select the table and columns to include in your worksheet
        </Text>
        <Flex mt={4}>
          <Flex column mr={4}>
            <ConnectionSelector
              connections={connections}
              selectConnection={selectConnection}
              selectedConnection={selectedConnection}
            />
            <ScopeSelector
              listResult={listResult}
              scopes={scopes}
              selectedScope={selectedScope}
              setSelectedScope={setSelectedScope}
              showTableScope
            />
          </Flex>
          <ColumnSelector
            isLoading={!query && selectedScope.length > scopes.length}
            query={query}
            deletedColumns={deletedColumns}
            toggleColumn={toggleColumn}
          />
        </Flex>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/TableForm.js