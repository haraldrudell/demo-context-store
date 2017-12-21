// @flow
import React, { PureComponent } from 'react';
import type { Query } from '@sigmacomputing/sling';

import { Popup, SearchBox, IconButton } from 'widgets';
import { type ButtonItem } from 'widgets/Popups/utils';

const BLANK_SEARCH_TERM = '';
const SEARCH_PLACEHOLDER = 'Search Columns';

type Props = {
  query: Query,
  addNewColumnFilter: (columnId: string) => void
};

type State = {
  searchTerm: string,
  filteredColumns: Array<ButtonItem>
};

function filterColumns(columnLabels, filterStr) {
  const columns = [];
  const lowerCaseFilterStr = filterStr.toLowerCase();
  Object.keys(columnLabels).forEach(id => {
    const name = columnLabels[id];
    if (name.toLowerCase().indexOf(lowerCaseFilterStr) > -1) {
      columns.push({ id, name });
    }
  });
  return columns;
}

export default class FilterAdder extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchTerm: BLANK_SEARCH_TERM,
      filteredColumns: filterColumns(props.query.view.labels, BLANK_SEARCH_TERM)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      filteredColumns: filterColumns(
        nextProps.query.view.labels,
        this.state.searchTerm
      )
    });
  }

  onSelectColumn = (id: string) => {
    this.props.addNewColumnFilter(id);
  };

  onSearch = (searchTerm: string) => {
    this.setState({
      searchTerm,
      filteredColumns: filterColumns(this.props.query.view.labels, searchTerm)
    });
  };

  render() {
    const { filteredColumns, searchTerm } = this.state;

    return (
      <Popup
        target={<IconButton p={1} size="12px" type="plus" />}
        popupPlacement="bottom-start"
        width="250px"
        closeOnClick={false}
      >
        <SearchBox
          listItems={filteredColumns}
          headerText="Choose a Column to Filter"
          searchPlaceholder={SEARCH_PLACEHOLDER}
          searchTerm={searchTerm}
          onSearch={this.onSearch}
          onSelectItem={this.onSelectColumn}
        />
      </Popup>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/FilterAdder.js