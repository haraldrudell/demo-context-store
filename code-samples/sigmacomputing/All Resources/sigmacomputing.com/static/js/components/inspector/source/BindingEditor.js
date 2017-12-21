// @flow
import React, { PureComponent } from 'react';

import { IconButton, ComboBox, Menu, Flex, Box } from 'widgets';
import colors from 'styles/colors';

const { MenuItem } = Menu;

// TO-DO: These Menus Used to be Searchable - Combine ComboBox and SearchBox widgets to re-add this feature

// function filterOption(input, option) {
//   return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
// }

type Props = {
  bindings: Array<{ source: string, target: string }>,
  sourceColumns: any,
  targetColumns: any,
  deleteBinding: number => void,
  updateBinding: (string, number, string) => void
};

export default class BindingEditor extends PureComponent<Props> {
  boundFunctions: any;

  constructor(props: Props) {
    super(props);

    this.boundFunctions = {
      source: {},
      target: {},
      delete: {}
    };
  }

  onChange = (where: string, index: number, columnId: string) => {
    this.props.updateBinding(where, index, columnId);
  };

  onDelete = (index: number) => {
    this.props.deleteBinding(index);
  };

  getBindedDelete = (index: number) => {
    if (!this.boundFunctions.delete[index]) {
      this.boundFunctions.delete[index] = this.onDelete.bind(this, index);
    }
    return this.boundFunctions.delete[index];
  };

  getBindedOnChange = (where: string, index: number) => {
    if (!this.boundFunctions[where][index]) {
      this.boundFunctions[where][index] = this.onChange.bind(
        this,
        where,
        index
      );
    }
    return this.boundFunctions[where][index];
  };

  render() {
    const { bindings, targetColumns, sourceColumns } = this.props;

    const sourceOptions = sourceColumns.map(column => (
      <MenuItem
        key={column.name}
        name={column.label ? column.label : column.name}
        id={column.name}
      />
    ));
    const targetOptions = targetColumns.map(column => (
      <MenuItem key={column.name} name={column.name} id={column.name}>
        {column.name}
      </MenuItem>
    ));

    return (
      <Box mt={3}>
        {bindings.map(({ source, target }, i) => (
          <Flex key={i} align="center" justify="space-between" mb={2}>
            <ComboBox
              width="210px"
              notFoundContent="Not Found"
              selected={source}
              setSelection={this.getBindedOnChange('source', i)}
              //filterOption={filterOption}
            >
              {sourceOptions}
            </ComboBox>
            <div
              css={`background-color: ${colors.darkBlue4}; height: 1px; width: 32px;`}
            />
            <ComboBox
              width="210px"
              notFoundContent="Not Found"
              setSelection={this.getBindedOnChange('target', i)}
              selected={target}
              //filterOption={filterOption}
            >
              {targetOptions}
            </ComboBox>
            <IconButton
              css={`position: absolute; right: -16px;`}
              size="12px"
              onClick={this.getBindedDelete(i)}
              type="close"
            />
          </Flex>
        ))}
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/inspector/source/BindingEditor.js