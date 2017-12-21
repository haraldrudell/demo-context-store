// @flow
import React, { PureComponent } from 'react';
import { type Query, checkColumns } from '@sigmacomputing/sling';
import { css } from 'emotion';

import { Box, Checkbox, Flex, Spin, Text, TextSpan } from 'widgets';
import SearchBar from 'components/widgets/SearchBar';
import { getColumnTypeIcon } from 'utils/table';
import colors from 'styles/colors';

function matchesSearch(label, search) {
  return label.toLowerCase().includes(search.toLowerCase());
}

const listItemStyles = css`
  cursor: pointer;

  &:hover,
  &.selected {
    background-color: ${colors.lightBlue};

    .addButton {
      visibility: visible;
    }
  }
`;

type Props = {
  query: ?Query,
  deletedColumns: { [key: string]: boolean },
  toggleColumn: (Array<string>) => void,
  isLoading: boolean
};

export default class ColumnSelector extends PureComponent<
  Props,
  {
    search: string
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      search: ''
    };
  }

  toggleColumn = (evt: SyntheticMouseEvent<HTMLElement>) => {
    const columnId = evt.currentTarget.dataset.id;
    this.props.toggleColumn([columnId]);
  };

  onSelectAll = () => {
    const { deletedColumns, toggleColumn, query } = this.props;
    if (query) {
      const allSelected = query.base.columns.reduce((selected, id) => {
        return selected && !deletedColumns[id];
      }, true);

      if (allSelected) {
        toggleColumn(query.base.columns);
      } else {
        const columnIds = query.base.columns.filter(id => deletedColumns[id]);
        toggleColumn(columnIds);
      }
    }
  };

  onSearch = (search: string) => {
    this.setState({ search });
  };

  renderSelectAll() {
    const { deletedColumns, query } = this.props;

    if (query) {
      const allSelected = query.base.columns.reduce((selected, id) => {
        return selected && !deletedColumns[id];
      }, true);

      return (
        <Flex
          className={listItemStyles}
          onClick={this.onSelectAll}
          align="center"
          px={2}
          py={1}
        >
          <Checkbox checked={allSelected}>
            <TextSpan font="bodyMedium" truncate>
              (Select All)
            </TextSpan>
          </Checkbox>
        </Flex>
      );
    }
    return null;
  }

  renderColumns() {
    const { query, deletedColumns } = this.props;
    if (query) {
      const columns = query.base.columns.map(id => {
        return {
          id,
          label: query.view.labels[id],
          deleted: deletedColumns[id]
        };
      });
      const checks = checkColumns(query);
      const types = {};
      checks.forEach((check, colId) => (types[colId] = check.ty));
      const { search } = this.state;

      return columns.map(column => {
        if (!matchesSearch(column.label, search)) return null;

        return (
          <Flex
            className={listItemStyles}
            key={column.id}
            onClick={this.toggleColumn}
            data-id={column.id}
            align="center"
            px={2}
            py={1}
          >
            <Checkbox checked={!column.deleted} />{' '}
            <Box flexGrow>
              <Text font="bodyMedium" truncate>
                {column.label}
              </Text>
            </Box>
            <Flex align="center" justify="center" width="20px">
              {getColumnTypeIcon(types[column.id])}
            </Flex>
          </Flex>
        );
      });
    }
    return null;
  }

  render() {
    const { isLoading } = this.props;

    return (
      <Flex flexGrow column>
        <SearchBar
          className={css`
            border: solid 1px ${colors.darkBlue5};
            height: 30px;
            padding-left: 0.5rem;
          `}
          inputClassName={css`
            width: 100%;
            margin-left: 0.5rem;
          `}
          placeholder="Search for a Column"
          onSearch={this.onSearch}
        />
        <div
          css={`
          height: 250px;
          overflow-x: hidden;
          overflow-y: auto;
          border: solid 1px ${colors.darkBlue5};
          border-top: none;
          position: relative;
        `}
        >
          {isLoading && (
            <Flex justify="center" align="center" css={`height: 100%;`}>
              <Spin />
            </Flex>
          )}
          {!isLoading && this.renderSelectAll()}
          {!isLoading && this.renderColumns()}
        </div>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/ColumnSelector.js