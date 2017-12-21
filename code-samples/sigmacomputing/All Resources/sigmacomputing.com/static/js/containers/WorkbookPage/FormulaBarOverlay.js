// @flow
import React, { PureComponent } from 'react';
import { getCompletions, checkFormula } from '@sigmacomputing/sling';
import type {
  ColumnId,
  Formula,
  FormulaValidation,
  PathRef,
  Query
} from '@sigmacomputing/sling';

import FormulaBar from 'components/editor/FormulaBar';
import { setFormula } from 'utils/ColumnActions';
import type { Selection } from 'types';
import { getSingleSelectedColumnId } from 'utils/selection';

type Props = {
  columnChecks: Map<ColumnId, FormulaValidation>,
  query: Query,
  setQuery: Query => void,
  selection: Selection,
  setEditorActive: boolean => void
};

type State = {
  columnId: ?ColumnId
};

function getFormula(query: Query, columnId: ColumnId): ?Formula {
  const col = query.columns[columnId];
  return col ? col.def.def : null;
}

function getFormulaColumnId(query: Query, selection: Selection): ?ColumnId {
  // TODO -- Update when every column supports formulas
  const columnId = getSingleSelectedColumnId(selection);
  if (!columnId) return null;
  if (!getFormula(query, columnId)) return null;
  return columnId;
}

function emptyDef(query: Query, columnId: ColumnId) {
  const def = getFormula(query, columnId);
  return def && def.type === 'empty';
}

export default class FormulaBarOverlay extends PureComponent<Props, State> {
  bar: ?FormulaBar;

  constructor(props: Props) {
    super(props);

    this.state = {
      columnId: getFormulaColumnId(props.query, props.selection)
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.query !== this.props.query ||
      nextProps.selection !== this.props.selection
    ) {
      this.setState({
        columnId: getFormulaColumnId(nextProps.query, nextProps.selection)
      });
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { columnId } = this.state;
    const { query } = this.props;
    if (
      columnId &&
      columnId !== prevState.columnId &&
      emptyDef(query, columnId)
    ) {
      // auto-focus if this is a new column (empty definition)
      this.focusEditor();
    }
  }

  flashEditor = () => {
    if (this.bar) this.bar.flashEditor();
  };

  getCompletions = (text: string, pos: number) => {
    const { columnId } = this.state;
    const { query } = this.props;

    const label = columnId ? query.view.labels[columnId] : undefined;
    return getCompletions(query, label, text, pos);
  };

  checkPending = (def: Formula) => {
    const { columnChecks, query } = this.props;
    return checkFormula(def, query, columnChecks);
  };

  lookupId = (id: ColumnId, parent?: ColumnId) => {
    const { query } = this.props;
    return query.lookupId(id, parent);
  };

  lookupName = (name: PathRef) => {
    const { query } = this.props;
    return query.lookupName(name);
  };

  setBarRef = (r: ?FormulaBar) => {
    this.bar = r;
  };

  focusEditor = () => {
    if (this.bar && this.state.columnId) this.bar.focusEditor();
  };

  setNode = (node: Formula) => {
    const { query, setQuery } = this.props;
    const { columnId } = this.state;
    if (!columnId) return;
    setQuery(setFormula(query, columnId, node));
  };

  render() {
    const { setEditorActive, query } = this.props;
    const { columnId } = this.state;

    return (
      <FormulaBar
        ref={this.setBarRef}
        node={columnId ? getFormula(query, columnId) : null}
        setNode={this.setNode}
        queryToken={query}
        checkFormula={this.checkPending}
        getCompletions={this.getCompletions}
        lookupId={this.lookupId}
        lookupName={this.lookupName}
        setEditorActive={setEditorActive}
      />
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/WorkbookPage/FormulaBarOverlay.js