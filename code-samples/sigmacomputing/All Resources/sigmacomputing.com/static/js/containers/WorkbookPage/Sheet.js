// @flow

import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';
import { checkColumns, Query, mkUniqName } from '@sigmacomputing/sling';
import type { ColumnId, FormulaValidation } from '@sigmacomputing/sling';
import invariant from 'invariant';

import type { ColumnTypes, DbConnectionType, Id, Selection } from 'types';
import { getSelectedColumns } from 'utils/selection';
import Toolbar from 'components/toolbar/Toolbar';
import KeyCaptureZone from 'components/KeyCaptureZone';
import TableFetcher from 'components/table/TableFetcher';
import Inspector from 'components/inspector/Inspector';
import FilterInspector from 'components/filter/FilterInspector';
import { addColumn } from 'utils/ColumnActions';
import Chart from 'utils/chart/Chart';
import { Box, Flex } from 'widgets';
import FormulaBarOverlay from './FormulaBarOverlay';
import ChartPicker from './ChartPicker';
import styles from './Workbook.less';

const cx = classnames.bind(styles);

function buildColumnTypes(
  columnChecks: Map<ColumnId, FormulaValidation>
): ColumnTypes {
  const columnTypes = {};
  columnChecks.forEach((check, colId) => {
    columnTypes[colId] = check.ty;
  });
  return columnTypes;
}

type Props = {|
  charts: { [Id]: Chart },
  connection: DbConnectionType,
  onSetChart: (Id, Chart) => void,
  onDeleteChart: Id => void,
  onUpdateQuery: Query => void,
  query: Query,
  title: string,
  worksheetId: Id
|};

type State = {|
  editorActive: boolean,
  selection: Selection,
  showEditor: boolean,
  columnChecks: Map<ColumnId, FormulaValidation>,
  columnTypes: ColumnTypes,
  currentChartId: ?Id,
  showChart: boolean,
  showTable: boolean,
  showInspector: boolean
|};

export default class Sheet extends PureComponent<Props, State> {
  formulaBarOverlay: ?FormulaBarOverlay;

  constructor(props: Props) {
    super(props);

    const columnChecks = checkColumns(props.query);

    this.state = {
      editorActive: false,
      selection: { type: 'none' },
      showEditor: false,
      columnChecks,
      columnTypes: buildColumnTypes(columnChecks),
      currentChartId: this.pickChart(),
      showChart: false,
      showTable: true,
      showInspector: true
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const nextQuery = nextProps.query;
    if (this.props.query !== nextQuery) {
      const columnChecks = checkColumns(nextQuery);
      this.setState({
        columnChecks,
        columnTypes: buildColumnTypes(columnChecks)
      });
    }
  }

  // XXX: This picks a random chart.
  pickChart = (except?: Id) => {
    const ids = Object.keys(this.props.charts);
    if (ids.length === 0) return null;
    return ids[0] === except ? ids[1] : ids[0];
  };

  setCurrentChart = (chartId: string) => {
    this.setState({
      currentChartId: chartId
    });

    // We deleted all the charts so we should not show charts anymore
    if (!this.state.showChart) {
      this.onToggleChart();
    }
  };

  onAddChart = () => {
    const { charts, onSetChart } = this.props;

    const chart = new Chart();

    // Generate a unique chart name
    const titles = [];
    Object.keys(charts).forEach(id => {
      titles.push(charts[id].config.title.text);
    });
    chart.config.setTitle(mkUniqName(titles, 'New Chart'));

    onSetChart(chart.id, chart);
    this.setCurrentChart(chart.id);

    if (!this.state.showChart) {
      this.onToggleChart();
    }
  };

  onDeleteChart = (id: Id) => {
    this.props.onDeleteChart(id);
    const newChartId = this.pickChart(id);

    this.setState({
      currentChartId: newChartId
    });
    if (!newChartId && this.state.showChart) {
      this.onToggleChart();
    }
  };

  onToggleChart = () => {
    this.setState({
      showChart: !this.state.showChart
    });
  };

  onToggleTable = () => {
    this.setState({
      showTable: !this.state.showTable
    });
  };

  onToggleInspector = () => {
    this.setState({
      showInspector: !this.state.showInspector
    });
  };

  onAddColumn = () => {
    const { query, onUpdateQuery } = this.props;

    onUpdateQuery(
      addColumn(
        query,
        'base',
        this.setSelection,
        Object.keys(getSelectedColumns(this.state.selection))
      )
    );
  };

  setSelection = (selection: Selection) => {
    this.setState({ selection });
  };

  focusFormula = (evt: SyntheticInputEvent<>) => {
    if (
      !this.formulaBarOverlay ||
      this.state.editorActive ||
      evt.metaKey // Chrome ignores these anyways
    ) {
      return;
    }

    // Keystroke should focus, not edit.
    this.formulaBarOverlay.focusEditor();
    evt.preventDefault();
  };

  setFormulaBarOverlayRef = (fbo: ?FormulaBarOverlay) => {
    this.formulaBarOverlay = fbo;
  };

  flashEditor = (evt: SyntheticInputEvent<>) => {
    evt.preventDefault();
    if (this.formulaBarOverlay) this.formulaBarOverlay.flashEditor();
  };

  setEditorActive = (editorActive: boolean) => {
    if (this.state.editorActive !== editorActive)
      this.setState({ editorActive });
  };

  toggleEditor = () => {
    this.setState({ showEditor: true });
  };

  onCloseEditor = () => {
    this.setState({ showEditor: false });
  };

  render() {
    const {
      editorActive,
      selection,
      showEditor,
      currentChartId,
      columnChecks,
      columnTypes,
      showChart,
      showTable,
      showInspector
    } = this.state;

    const {
      charts,
      connection,
      onUpdateQuery,
      query,
      title,
      worksheetId
    } = this.props;

    invariant(query, 'These fields should be here');

    return (
      <Flex column flexGrow className={styles.workbook}>
        <Toolbar
          charts={this.props.charts}
          columnTypes={columnTypes}
          connectionId={this.props.connection.id}
          currentChartId={currentChartId}
          onAddChart={this.onAddChart}
          onAddColumn={this.onAddColumn}
          onDeleteChart={this.onDeleteChart}
          onSelectChart={this.setCurrentChart}
          onToggleChart={this.onToggleChart}
          onToggleInspector={this.onToggleInspector}
          onToggleTable={this.onToggleTable}
          query={this.props.query}
          showChart={showChart}
          showInspector={showInspector}
          showTable={showTable}
        />
        <Flex flexGrow>
          <div
            className={cx({ editorActive })}
            onMouseDown={this.flashEditor}
          />
          <Box flexGrow>
            <KeyCaptureZone
              css={`height: 100%;`}
              onKeyPress={this.focusFormula}
            >
              <Flex css={`height: 100%;`} column flexGrow>
                <FilterInspector
                  query={query}
                  connectionId={connection.id}
                  setQuery={onUpdateQuery}
                  selection={selection}
                  setSelection={this.setSelection}
                  columnTypes={columnTypes}
                />
                <Flex
                  bg="darkBlue6"
                  bt={1}
                  bx={1}
                  borderColor="darkBlue4"
                  column
                  flexGrow
                  mt={3}
                  mx={3}
                >
                  {showChart && (
                    <ChartPicker
                      charts={charts}
                      connectionId={connection.id}
                      current={currentChartId}
                      query={query}
                      columnTypes={columnTypes}
                      onAdd={this.onAddChart}
                      onDelete={this.onDeleteChart}
                      onUpdate={this.props.onSetChart}
                      onToggleEditor={this.toggleEditor}
                    />
                  )}
                  {showTable && (
                    <FormulaBarOverlay
                      ref={this.setFormulaBarOverlayRef}
                      columnChecks={columnChecks}
                      query={query}
                      setQuery={onUpdateQuery}
                      selection={selection}
                      setEditorActive={this.setEditorActive}
                    />
                  )}
                  {showTable && (
                    <TableFetcher
                      connectionId={connection.id}
                      query={query}
                      setQuery={onUpdateQuery}
                      selection={selection}
                      setSelection={this.setSelection}
                      columnTypes={columnTypes}
                    />
                  )}
                </Flex>
              </Flex>
            </KeyCaptureZone>
          </Box>
          {showInspector && (
            <Inspector
              className={styles.sider}
              chart={currentChartId ? charts[currentChartId] : null}
              onUpdateChart={this.props.onSetChart}
              onCloseEditor={this.onCloseEditor}
              query={query}
              setQuery={onUpdateQuery}
              selection={selection}
              setSelection={this.setSelection}
              columnTypes={columnTypes}
              label={title}
              workbookId={worksheetId}
              connection={connection}
              showEditor={showEditor}
            />
          )}
        </Flex>
      </Flex>
    );
  }
}



// WEBPACK FOOTER //
// ./src/containers/WorkbookPage/Sheet.js