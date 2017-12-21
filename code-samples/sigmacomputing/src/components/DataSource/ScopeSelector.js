// @flow
import React, { PureComponent } from 'react';

import { Flex } from 'widgets';
import type { TableObject } from 'types/table';
import SelectScope from './SelectScope';

type Props = {
  listResult: ?Array<?Array<TableObject>>,
  scopes: Array<string>,
  selectedScope: Array<string>,
  setSelectedScope: (Array<string>) => void,
  showTableScope?: boolean
};

type State = {
  loadingIndex: ?number
};

export default class ScopeSelector extends PureComponent<Props, State> {
  boundFunctions: { [index: number]: (string) => void };

  constructor(props: Props) {
    super(props);
    this.state = {
      loadingIndex: null
    };

    this.boundFunctions = {};
  }

  componentWillReceiveProps(nextProps: Props) {
    const { loadingIndex } = this.state;
    if (
      loadingIndex !== null &&
      loadingIndex !== undefined &&
      nextProps.listResult &&
      nextProps.listResult[loadingIndex]
    ) {
      this.setState({ loadingIndex: null });
    }
  }

  getBoundSetSelectedScope = (index: number) => {
    if (!this.boundFunctions[index]) {
      this.boundFunctions[index] = this.setSelectedScope.bind(this, index);
    }

    return this.boundFunctions[index];
  };

  setSelectedScope = (index: number, value: string) => {
    const selectedScope =
      index >= 1 ? this.props.selectedScope.slice(0, index) : [];
    selectedScope[index] = value;
    this.setState({ loadingIndex: index });
    this.props.setSelectedScope(selectedScope);
  };

  render() {
    const { loadingIndex } = this.state;
    const {
      scopes = [],
      selectedScope = [],
      listResult = [],
      showTableScope
    } = this.props;

    const inputs = [];

    for (let i = 0; i < 3; i++) {
      const r = listResult ? listResult[i] : null;
      let input;
      if (scopes[i] || (showTableScope && r)) {
        input = (
          <SelectScope
            key={i}
            isLoading={loadingIndex === i}
            scope={scopes[i] || 'table'}
            selectedScope={selectedScope[i]}
            setSelectedScope={this.getBoundSetSelectedScope(i)}
            listScopeResult={r}
          />
        );
      } else {
        input = (
          <SelectScope key={i} selectedScope={null} listScopeResult={null} />
        );
      }
      inputs.push(input);
    }

    return <Flex column>{inputs}</Flex>;
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/ScopeSelector.js