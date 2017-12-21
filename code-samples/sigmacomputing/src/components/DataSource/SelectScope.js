// @flow
import React, { PureComponent } from 'react';
import { capitalize } from 'lodash';

import type { TableObject } from 'types/table';
import { Box, Flex, ComboBox, Menu, Spin, TextSpan } from 'widgets';

const { MenuItem } = Menu;

type Props = {
  isLoading?: boolean,
  scope?: string,
  selectedScope: ?string,
  listScopeResult: ?Array<TableObject>,
  setSelectedScope?: (value: string) => void
};

export default class SelectScope extends PureComponent<Props> {
  onChange = (value: string) => {
    if (this.props.setSelectedScope && value !== this.props.selectedScope) {
      this.props.setSelectedScope(value);
    }
  };

  render() {
    const { scope, isLoading, listScopeResult, selectedScope } = this.props;

    let options;

    if (listScopeResult) {
      options = listScopeResult.map(r => (
        <MenuItem key={r.name} id={r.name} name={r.name} />
      ));
    } else if (selectedScope) {
      options = [
        <MenuItem key={selectedScope} id={selectedScope} name={selectedScope} />
      ];
    }

    const label = scope ? capitalize(scope) : 'scope';

    return (
      <Box pb={2} color="darkBlue2" opacity={scope ? 1 : 0}>
        <Flex align="center" font="header5">
          <TextSpan pb={1}>{label}</TextSpan>
          {isLoading && (
            <span>
              &nbsp;<Spin />
            </span>
          )}
        </Flex>
        <ComboBox
          width="190px"
          maxHeight="300px"
          selected={selectedScope}
          placeholder={`Select a ${label}`}
          optionPlaceholder={`No ${label} found`}
          disabled={!options}
          setSelection={this.onChange}
        >
          {options}
        </ComboBox>
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/SelectScope.js