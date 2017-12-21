// @flow

import * as React from 'react';
import { Query } from '@sigmacomputing/sling';
import sqlFormatter from 'sql-formatter';

import Fetcher from 'components/Fetcher';
import { Box, IconButton, Modal, Text } from 'widgets';
import Loading from 'components/widgets/Loading';
import { getSql, handleApiError, needsEval } from 'utils/apiCaller';

type Props = {|
  query: Query,
  connectionId: string
|};

function ShowSqlDisplay({ data }: { data: ?string }) {
  if (data == null) return <Loading text="Fetching SQL..." />;

  return (
    <Box>
      <Text font="header3">Generated SQL:</Text>
      <Text
        css={`
          max-height: 80vh;
          overflow-y: scroll;
        `}
        font="formulaSmall"
        mt={2}
      >
        <pre>{sqlFormatter.format(data)}</pre>
      </Text>
    </Box>
  );
}

const SqlFetcher = Fetcher(
  ShowSqlDisplay,
  (props: Props) =>
    getSql(props.query, props.connectionId).catch(e => {
      handleApiError('GetSql failure', e);
    }),
  (nextProps: Props, currentProps: Props) =>
    needsEval(nextProps.query, currentProps.query)
);

export default class ShowSql extends React.Component<
  Props,
  {| showModal: boolean |}
> {
  state = { showModal: false };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    const { connectionId, query } = this.props;
    return (
      <div>
        <IconButton onClick={this.toggleModal} type="eye" />
        <Modal
          closable={false}
          footer={null}
          onClose={this.toggleModal}
          width="80vw"
          visible={this.state.showModal}
        >
          <SqlFetcher connectionId={connectionId} query={query} />
        </Modal>
      </div>
    );
  }
}



// WEBPACK FOOTER //
// ./src/components/ShowSql.js