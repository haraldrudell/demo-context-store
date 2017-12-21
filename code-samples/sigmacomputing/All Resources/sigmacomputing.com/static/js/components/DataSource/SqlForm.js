// @flow
import React, { PureComponent } from 'react';
import classnames from 'classnames/bind';

import { Box, Button, Flex, Input, Text } from 'widgets';
import type { TableObject } from 'types/table';
import type { DbConnectionType, Id } from 'types';
import ConnectionSelector from 'components/DataSource/ConnectionSelector';
// import ScopeSelector from 'components/DataSource/ScopeSelector';
import fontStyles from 'styles/typography.less';
import styles from './SqlForm.less';
const cx = classnames.bind(styles);

type Props = {
  listResult: ?Array<?Array<TableObject>>,
  selectedScope: Array<string>, // database / schema etc selected by the user
  setSelectedScope: (Array<string>) => void,
  scopes: Array<string>,

  onSetSql: string => Promise<*>,

  connections: { [string]: DbConnectionType },
  selectConnection?: Id => void,
  selectedConnection: ?{ id: Id, label: string }
};

export default class SqlForm extends PureComponent<
  Props,
  {
    sql: string,
    isLoading: boolean
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sql: '',
      isLoading: false
    };
  }

  setSql = () => {
    this.setState({
      isLoading: true
    });
    this.props.onSetSql(this.state.sql).then(() => {
      this.setState({
        isLoading: false
      });
    });
  };

  onChange = (evt: { target: { value: string } }) => {
    this.setState({
      sql: evt.target.value
    });
  };

  render() {
    const { connections, selectConnection, selectedConnection } = this.props;
    const { isLoading, sql } = this.state;

    return (
      <Box>
        <Text font="header4">Type or paste your query below:</Text>
        <Flex mt={4} flexGrow>
          <Flex column mr={4}>
            <ConnectionSelector
              connections={connections}
              selectConnection={selectConnection}
              selectedConnection={selectedConnection}
            />
            {/* Currently SQLForm doesn't account for scoping
            <ScopeSelector
              listResult={listResult}
              scopes={scopes}
              selectedScope={selectedScope}
              setSelectedScope={setSelectedScope}
            />*/}
          </Flex>
          <Flex column flexGrow>
            <Input
              className={cx('flex-item', fontStyles.formula, 'input')}
              autoFocus
              rows={7}
              placeholder="Custom SQL Query"
              spellCheck="false"
              type="textarea"
              onChange={this.onChange}
              value={sql}
            />
            <Flex mt={2} justify="flex-end">
              <Button
                type="secondary"
                onClick={this.setSql}
                loading={isLoading}
              >
                Update
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/DataSource/SqlForm.js