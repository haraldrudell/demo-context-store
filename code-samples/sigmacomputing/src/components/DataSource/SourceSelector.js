// @flow
import React, { PureComponent } from 'react';

import type { QuerySource } from 'types/workbook';
import { Flex, Text } from 'widgets';

import SqlIcon from 'icons/sql_color.svg';
import TableIcon from 'icons/table_color.svg';
import WorksheetIcon from 'icons/worksheet_color.svg';
import styles from './SourceSelector.less';

export default class SourceSelector extends PureComponent<{
  source: QuerySource,
  setSource: QuerySource => void,
  onNext: () => void,
  allowSQL: boolean
}> {
  onSourceSelect = (evt: SyntheticMouseEvent<HTMLElement>) => {
    const source = evt.currentTarget.dataset.type;
    if (source !== 'table' && source !== 'sql' && source !== 'query')
      throw Error(`Invalid Type for SourceSelector: ${source}`);
    this.props.setSource(source);
  };

  onSourceNext = (evt: SyntheticMouseEvent<HTMLElement>) => {
    this.onSourceSelect(evt);
    this.props.onNext();
  };

  renderBlockType({
    type,
    icon,
    text
  }: {
    type: string,
    icon: string,
    text: string
  }) {
    const { source } = this.props;
    const isSelected = type === source;
    return (
      <Flex
        className={styles.block}
        b={isSelected ? 2 : 1}
        bg="white"
        borderColor={isSelected ? 'blue' : 'darkBlue4'}
        borderRadius={4}
        data-type={type}
        onClick={this.onSourceSelect}
        onDoubleClick={this.onSourceNext}
        column
        align="center"
        justify="center"
      >
        <img alt={text} src={icon} />
        <Text font="header4">{text}</Text>
      </Flex>
    );
  }

  render() {
    const { allowSQL } = this.props;
    return (
      <div className={styles.container}>
        <Text font="header4">Select the type of data </Text>
        <Flex mt={2}>
          {this.renderBlockType({
            type: 'table',
            icon: TableIcon,
            text: 'Table'
          })}
          {allowSQL &&
            this.renderBlockType({
              type: 'sql',
              icon: SqlIcon,
              text: 'Custom SQL'
            })}
          {this.renderBlockType({
            type: 'query',
            icon: WorksheetIcon,
            text: 'Worksheet'
          })}
        </Flex>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/SourceSelector.js