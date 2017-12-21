// @flow
import React, { Component } from 'react';
import { Query } from '@sigmacomputing/sling';
import styled, { css } from 'react-emotion';

import type { Selection, Id, DbConnectionType, ColumnTypes } from 'types';
import SourceInspector from 'components/inspector/source/SourceInspector';
import ColumnView from 'components/ColumnView';
import { collapseOpacity } from 'styles/transitions';

const curtainHide = css`
  opacity: 0;
  pointer-events: none;
`;

const curtainShow = css`
  opacity: 0.15;
  pointer-events: default;
`;

const Curtain = styled.div`
  position: absolute;
  top: 0;
  height: calc(100% - 33px);
  width: 100%;
  background: black;
  ${props => (props.show ? curtainShow : curtainHide)};
  ${collapseOpacity};
`;

type Props = {
  selection: Selection,
  setSelection: Selection => void,
  columnTypes: ColumnTypes,
  label: string,
  query: Query,
  setQuery: Query => void,
  workbookId: Id,
  connection: DbConnectionType,
  className: string
};

type State = {
  sourcesOpen: boolean
};

export default class Inspector extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sourcesOpen: false
    };
  }

  onToggleSources = () => {
    this.setState({
      sourcesOpen: !this.state.sourcesOpen
    });
  };

  render() {
    const {
      query,
      setQuery,
      selection,
      setSelection,
      columnTypes,
      label,
      workbookId,
      connection,
      className
    } = this.props;
    const { sourcesOpen } = this.state;

    return (
      <div className={`flex-column ${className}`}>
        <ColumnView
          query={query}
          selection={selection}
          setSelection={setSelection}
          setQuery={setQuery}
          columnTypes={columnTypes}
        />
        <Curtain show={sourcesOpen} />
        <SourceInspector
          query={query}
          setQuery={setQuery}
          sourceLabel={label}
          workbookId={workbookId}
          connection={connection}
          sourcesOpen={sourcesOpen}
          onToggleSources={this.onToggleSources}
        />
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/inspector/Inspector.js