// @flow
import * as React from 'react';
import Highlighter from 'react-highlight-words';

import { Text, Box } from 'widgets';
import Menu from '../Menu';
import SearchBar from 'components/widgets/SearchBar';
import { type ButtonItem } from '../utils';

const { MenuItem } = Menu;

type Props = {
  listItems: Array<ButtonItem>,
  headerText: string,
  searchPlaceholder: string,
  searchTerm: string,
  onSearch: string => void,
  onSelectItem: string => void
};

export default class SearchBox extends React.PureComponent<Props> {
  render() {
    const {
      listItems,
      headerText,
      searchPlaceholder,
      searchTerm,
      onSearch,
      onSelectItem
    } = this.props;

    const menuItems = listItems.map(item => {
      return (
        <MenuItem
          key={item.id}
          id={item.id}
          name={
            <Highlighter
              searchWords={[searchTerm]}
              textToHighlight={item.name}
            />
          }
        />
      );
    });

    return (
      <Box py={2} bg="white">
        <Box pl={2} pb={2} bb={1} borderColor="darkBlue4">
          <Text font="header5" pb={2}>
            {headerText}
          </Text>
          <SearchBar onSearch={onSearch} placeholder={searchPlaceholder} />
        </Box>
        {menuItems.length > 0 ? (
          <Menu onMenuItemClick={onSelectItem} maxHeight="20rem">
            {menuItems}
          </Menu>
        ) : (
          <Text pt={2} pl={2} font="bodyMedium" color="darkBlue3">
            No Results Found
          </Text>
        )}
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/widgets/Popups/SearchBox/index.js