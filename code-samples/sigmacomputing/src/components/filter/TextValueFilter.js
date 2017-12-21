// @flow

import React, { PureComponent } from 'react';

import { Box, Divider, Flex, Icon, Text } from 'widgets';
import SearchBar from 'components/widgets/SearchBar';
import { LoadFailure, SelectedValues, TopValues } from './ValueFilter';
import Loading from 'components/widgets/Loading';
import type { ValueDesc } from './ValueFilter';

const AddButton = (props: {}) => (
  <Flex
    css={`cursor: pointer;`}
    align="center"
    bb={1}
    borderColor="darkBlue5"
    font="header6"
    justify="center"
    py={1}
    {...props}
  >
    <Icon mr={1} type="filter" />
    Add as a filter
  </Flex>
);

export default class TextValueFilter extends PureComponent<{|
  isInclude: boolean,
  onRemove: string => void,
  onSearch?: string => void,
  onSearchClear: () => void,
  onSelect: string => void,
  onSetInclude: boolean => void,
  searchTerm: ?string,
  selectedValues: Array<ValueDesc>,
  searchValues?: Array<ValueDesc> | 'failed' | null,
  topValues?: Array<ValueDesc> | 'failed' | null
|}> {
  searchBar: ?SearchBar;

  handleSelectSearchValue = (key: ?string) => {
    const { onSelect, onSearchClear } = this.props;
    if (key) onSelect(key);
    onSearchClear();
    if (this.searchBar) this.searchBar.clear();
  };

  renderSearchValues() {
    const { searchTerm, searchValues } = this.props;

    if (!searchValues)
      return (
        <Box width="100%" css={`height: 80px;`}>
          <Loading text="Loading" />
        </Box>
      );
    if (searchValues === 'failed')
      return <LoadFailure title="Failure to load data" />;
    if (searchValues.length === 0)
      return <LoadFailure title="No matching values" />;
    return (
      <Box bg="darkBlue6" py={1}>
        <Text font="header5" p={2}>
          Search Results
        </Text>
        <TopValues
          onSelect={this.handleSelectSearchValue}
          searchTerm={searchTerm}
          values={searchValues}
        />
      </Box>
    );
  }

  renderTopValues() {
    const { onSelect, searchTerm, topValues } = this.props;

    if (!topValues)
      return (
        <Box width="100%" css={`height: 80px;`}>
          <Loading text="Loading" />
        </Box>
      );
    if (topValues === 'failed')
      return <LoadFailure title="Failure to load data" />;
    return (
      <TopValues
        onSelect={onSelect}
        values={topValues}
        searchTerm={searchTerm}
      />
    );
  }

  setSearchBarRef = (r: ?SearchBar) => {
    this.searchBar = r;
  };

  render() {
    const {
      isInclude,
      onRemove,
      onSearch,
      onSetInclude,
      searchTerm,
      selectedValues
    } = this.props;

    return (
      <div>
        {onSearch && (
          <SearchBar ref={this.setSearchBarRef} onSearch={onSearch} />
        )}
        <Divider color="darkBlue5" my={0} />
        {searchTerm != null ? (
          <Box>
            <AddButton
              onClick={() => this.handleSelectSearchValue(searchTerm)}
            />
            {this.renderSearchValues()}
          </Box>
        ) : (
          <Box>
            <SelectedValues
              isInclude={isInclude}
              onRemove={onRemove}
              onSetInclude={onSetInclude}
              values={selectedValues}
            />
            {this.renderTopValues()}
          </Box>
        )}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/filter/TextValueFilter.js