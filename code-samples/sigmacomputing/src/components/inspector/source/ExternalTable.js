// @flow
import React, { PureComponent } from 'react';
import type { ExternalColumn } from '@sigmacomputing/sling';

import { IconButton, Text } from 'widgets';
import SearchBar from 'components/widgets/SearchBar';
import styles from './ExternalTable.less';

type Props = {
  inputId: string,
  columns: Array<ExternalColumn>,
  onAddColumn: (string, string) => void
};

type State = {
  search: string
};

export default class TableComponent extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { search: '' };
  }

  onSearch = (search: string) => {
    this.setState({ search });
  };

  onAddColumn = (evt: SyntheticMouseEvent<HTMLElement>) => {
    const column = evt.currentTarget.dataset.column;
    const { inputId, onAddColumn } = this.props;
    onAddColumn(inputId, column);
  };

  render() {
    const { columns } = this.props;
    const searchTerm = this.state.search.toLowerCase();
    const displayColumns = columns.filter(col => {
      return col.name.toLowerCase().includes(searchTerm);
    });

    return (
      <div className={styles.container}>
        <SearchBar
          className={styles.searchBox}
          inputClassName={styles.searchInput}
          onSearch={this.onSearch}
          instantSearch={true}
        />
        <div className={styles.columns}>
          {displayColumns.length > 0 ? (
            displayColumns.map(column => (
              <div
                key={column.name}
                className={`${styles.column} flex-row align-center`}
              >
                <div className="flex-item">{column.name}</div>
                <IconButton
                  data-column={column.name}
                  onClick={this.onAddColumn}
                  type="add"
                />
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <Text font="bodySmall">No Matching Columns</Text>
            </div>
          )}
        </div>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/inspector/source/ExternalTable.js