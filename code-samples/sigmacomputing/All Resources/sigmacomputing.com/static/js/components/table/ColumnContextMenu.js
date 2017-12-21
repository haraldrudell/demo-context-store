// @flow
import React, { Component } from 'react';
import type { Query } from '@sigmacomputing/sling';

import type { Id, SelectedColumns, Selection, ColumnTypes } from 'types';
import { Popup } from 'widgets';
import ColumnMultiSorterModal from 'components/ColumnMultiSorter/ColumnMultiSorterModal';
import ColumnMenu from './ColumnMenu';

type Props = {
  query: Query,
  setQuery: Query => void,
  selectColumns: Selection => void,
  deselectColumns: (Array<Id>) => void,
  selectedColumns: SelectedColumns,
  onRename?: (columnId: Id) => void,
  columnTypes: ColumnTypes
};

export default class ColumnContextMenu extends Component<
  Props,
  {
    columnId: ?string,
    levelId: ?string,
    showColumnMultiSorterModal: boolean
  }
> {
  popup: ?Popup;
  state: {
    columnId: ?string,
    levelId: ?string,
    showColumnMultiSorterModal: boolean
  } = {
    columnId: null,
    levelId: null,
    showColumnMultiSorterModal: false
  };

  onContextMenu = (
    target: SyntheticMouseEvent<>,
    columnId: Id,
    levelId: ?Id
  ) => {
    this.setState({ columnId, levelId });
    if (this.popup) this.popup.setTarget(target);
  };

  setPopupRef = (r: ?Popup) => {
    this.popup = r;
  };

  hideColumnMultiSorterModal = () => {
    this.setState({
      showColumnMultiSorterModal: false
    });
  };

  showColumnMultiSorterModal = () => {
    this.setState({ showColumnMultiSorterModal: true });
  };

  render() {
    const { query, setQuery, columnTypes } = this.props;
    const { columnId, levelId, showColumnMultiSorterModal } = this.state;

    return (
      <div>
        <Popup ref={this.setPopupRef} popupPlacement={'bottom-start'}>
          <ColumnMenu
            {...this.props}
            columnId={columnId}
            levelId={levelId}
            showColumnMultiSorterModal={this.showColumnMultiSorterModal}
          />
        </Popup>
        {showColumnMultiSorterModal && (
          <ColumnMultiSorterModal
            visible={true}
            onClose={this.hideColumnMultiSorterModal}
            query={query}
            levelId={levelId}
            setQuery={setQuery}
            columnTypes={columnTypes}
          />
        )}
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/table/ColumnContextMenu.js