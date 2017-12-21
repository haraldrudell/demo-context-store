// @flow
import * as React from 'react';

import QueryTable from './QueryTable';
import type { TableData } from './tableData';
import type { Selection } from 'types';
import { EMPTY_SELECTION } from 'utils/selection';

type Props = {
  children: React.Element<typeof QueryTable>,
  selection: Selection,
  setSelection: Selection => void,
  tableData: TableData
};

type State = {
  validSelection: Selection
};

// Cell selections include the flatOffset of the selected cell
// When the value changes, the flatOffset might be > the new value length
// This clears the selection in that case and ensures downstream components see only valid selections
function mkValidSelection(props: Props) {
  const { selection, setSelection, tableData } = props;

  if (
    selection.type === 'cell' &&
    !tableData.isValidCellPosition(selection.columnId, selection.flatOffset)
  ) {
    // cell selection is no longer within the value
    // clear it
    setSelection(EMPTY_SELECTION);
    return EMPTY_SELECTION;
  }

  return selection;
}

export default class SelectionValidator extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      validSelection: mkValidSelection(props)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.selection !== this.props.selection ||
      nextProps.tableData !== this.props.tableData
    ) {
      this.setState({
        validSelection: mkValidSelection(nextProps)
      });
    }
  }

  render() {
    const { validSelection } = this.state;

    const Child = React.Children.only(this.props.children);
    return React.cloneElement(Child, { selection: validSelection });
  }
}



// WEBPACK FOOTER //
// ./src/components/table/SelectionValidator.js