// @flow
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import type { RouterHistory } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import invariant from 'invariant';
import { Query } from '@sigmacomputing/sling';

import { decodeWorksheetUrl, encodeWorksheetUrl } from 'utils/url';
import { publish } from 'utils/events';
import { download, handleApiError } from 'utils/apiCaller';
import Chart from 'utils/chart/Chart';
import { GoogleOAuthFlow } from 'utils/oauth2';
import {
  createWorkbook as createWorksheet,
  WorksheetFragment,
  mapWorksheet,
  renameWorkbook as renameWorksheet,
  updateWorksheet,
  type WorksheetTy
} from 'api/workbook';
import type { ExportFormat, Id } from 'types';

import { IconButton, Menu, Tooltip } from 'widgets';
import Header from 'components/nav/Header';
import LoadingCurtain from 'components/LoadingCurtain';
import MoveModal from 'containers/Library/MoveModal';

import Sheet from './Sheet';
import styles from './Workbook.less';

const { MenuItem, SubMenu } = Menu;

type Props = {
  history: RouterHistory,
  rename: string => void,
  saveCopy: (Query, { [Id]: Chart }) => void,
  updateWorksheet: (Query, { [Id]: Chart }) => void,
  worksheet: WorksheetTy
};

class Worksheet extends Component<
  Props,
  {
    charts: { [Id]: Chart },
    fetchGoogleToken: boolean,
    hasUpdated: boolean,
    oauthReady: boolean,
    onFetchGoogleToken: ?(?string) => void,
    query: Query,
    showMoveModal: boolean
  }
> {
  constructor(props: Props) {
    super(props);

    const { worksheet } = props;

    this.state = {
      charts: worksheet.charts,
      fetchGoogleToken: false,
      hasUpdated: false,
      oauthReady: worksheet.connection.type !== 'bigQuery',
      onFetchGoogleToken: null,
      query: worksheet.query,
      showMoveModal: false
    };
  }

  componentDidMount() {
    const { worksheet } = this.props;
    publish('OpenWorkbook', { workbookId: worksheet.inodeId });

    if (!this.state.oauthReady) {
      this.setupOauth();
    }
  }

  setupOauth() {
    const handler = (token: ?string) => {
      if (!token) {
        return this.props.history.replace('/');
      }

      this.setState({
        fetchGoogleToken: false,
        onFetchGoogleToken: null,
        oauthReady: true
      });
    };

    this.setState({
      fetchGoogleToken: true,
      onFetchGoogleToken: handler
    });
  }

  onNewWorksheet = () => {
    this.props.history.push('/new');
  };

  onExport = (format: ExportFormat) => {
    const { worksheet } = this.props;
    const fileName = `${worksheet.title}.${format}`;
    download(
      this.state.query,
      format,
      fileName,
      worksheet.connection.id
    ).catch(e => handleApiError('Download Error', e));
  };

  hideMoveModal = () => {
    this.setState({
      showMoveModal: false
    });
  };

  showMoveModal = () => {
    this.setState({
      showMoveModal: true
    });
  };

  saveCopy = () => {
    this.props.saveCopy(this.state.query, this.state.charts);
  };

  composeWorksheet = () => {
    // XXX JDF: disabled for now
  };

  _updateQuery(query: Query, charts: { [Id]: Chart }) {
    this.setState({ charts, query });

    const { worksheet } = this.props;
    if (worksheet.canEdit) {
      this.props.updateWorksheet(query, charts);
    } else {
      this.setState({ hasUpdated: true });
    }
  }

  deleteChart = (chartId: Id) => {
    const newCharts = { ...this.state.charts };
    delete newCharts[chartId];
    this._updateQuery(this.state.query, newCharts);
  };

  setChart = (chartId: Id, chart: Chart) => {
    const charts = {
      ...this.state.charts,
      [chartId]: chart
    };
    this._updateQuery(this.state.query, charts);
  };

  updateQuery = (query: Query) => {
    this._updateQuery(query, this.state.charts);
  };

  onMenuClick = (action: string) => {
    switch (action) {
      case 'csv':
      case 'xlsx':
        this.onExport(action);
        break;
      case 'save':
        this.saveCopy();
        break;
      case 'compose':
        this.composeWorksheet();
        break;
      case 'folder':
        this.showMoveModal();
        break;
      default:
        break;
    }
  };

  renderActions() {
    return (
      <Tooltip title="New Worksheet" trigger="hover" placement="bottom">
        <IconButton type="new-worksheet" onClick={this.onNewWorksheet} />
      </Tooltip>
    );
  }

  renderMenuActions() {
    const { canEdit } = this.props.worksheet;
    return (
      <Menu onMenuItemClick={this.onMenuClick}>
        <MenuItem id="folder" disabled={!canEdit} name="Move" />
        <MenuItem id="save" name="Save Copy" />
        {/* <MenuItem id="compose" name="Compose Worksheet" /> */}
        <SubMenu id="download" name="Download">
          <MenuItem id="csv" name="CSV" />
          <MenuItem id="xlsx" name="Excel" />
        </SubMenu>
      </Menu>
    );
  }

  render() {
    if (!this.state.oauthReady) {
      const { fetchGoogleToken, onFetchGoogleToken } = this.state;
      return (
        <div>
          <GoogleOAuthFlow
            active={fetchGoogleToken}
            onComplete={onFetchGoogleToken}
            wrapClassName={styles.oauthModal}
          />
        </div>
      );
    }

    const { worksheet } = this.props;
    const { charts, hasUpdated, query, showMoveModal } = this.state;

    return (
      <div className={styles.page}>
        <Helmet title={`${worksheet.title} - Sigma`} />
        <Header
          title={worksheet.title}
          folder={worksheet.folder}
          hasUpdated={hasUpdated}
          actions={this.renderActions()}
          menu={this.renderMenuActions()}
          onRename={this.props.rename}
        />
        <Sheet
          charts={charts}
          connection={worksheet.connection}
          onDeleteChart={this.deleteChart}
          onSetChart={this.setChart}
          onUpdateQuery={this.updateQuery}
          query={query}
          title={worksheet.title}
          worksheetId={worksheet.inodeId}
        />
        {showMoveModal && (
          <MoveModal
            currentFolderId={worksheet.folder.inodeId}
            inodeId={worksheet.inodeId}
            onClose={this.hideMoveModal}
          />
        )}
      </div>
    );
  }
}

type ContainerProps = {|
  data: ?{
    worksheet: WorksheetTy
  },
  history: RouterHistory,
  loading: boolean
|};

class WorksheetContainer extends Component<ContainerProps> {
  saveCopy = (query: Query, charts: { [Id]: Chart }) => {
    const { data } = this.props;
    invariant(data != null, 'Missing data for worksheet');

    const { worksheet } = data;
    const newTitle = `Copy of ${worksheet.title}`;
    createWorksheet(
      {
        title: newTitle,
        connectionId: worksheet.connection.id,
        connectionType: worksheet.connection.type
      },
      query,
      undefined,
      charts
    ).then(newWsId => {
      this.props.history.push(encodeWorksheetUrl(newWsId, newTitle));
    });
  };

  rename = title => {
    const { data } = this.props;
    invariant(data != null, 'Missing data for worksheet');
    const url = encodeWorksheetUrl(data.worksheet.inodeId, title);
    this.props.history.replace(url);
    renameWorksheet(data.worksheet.inodeId, title);
  };

  updateWorksheet = (query: Query, charts: { [Id]: Chart }) => {
    const { data } = this.props;
    invariant(data != null, 'Missing data for worksheet');
    updateWorksheet(data.worksheet.inodeId, query, charts);
  };

  render() {
    const { data, history, loading } = this.props;
    if (loading) return <LoadingCurtain text="Loading Query" />;

    invariant(data != null, 'Missing data for worksheet');

    return (
      <Worksheet
        history={history}
        rename={this.rename}
        saveCopy={this.saveCopy}
        updateWorksheet={this.updateWorksheet}
        worksheet={data.worksheet}
      />
    );
  }
}

const WorksheetQuery = gql`
  query GetWorksheet($worksheetId: UUID!) {
    organization {
      worksheet(id: $worksheetId) {
        ...WorksheetFragment
      }
    }
  }
  ${WorksheetFragment}
`;

const WorksheetPage = graphql(WorksheetQuery, {
  options: ({ match: { url } }) => ({
    variables: {
      worksheetId: decodeWorksheetUrl(url)
    }
  }),
  props: ({ ownProps, data: { loading, organization } }) => {
    const data = loading
      ? null
      : {
          worksheet: mapWorksheet(organization.worksheet)
        };

    return {
      ...ownProps,
      data,
      loading
    };
  }
})(WorksheetContainer);

export default WorksheetPage;



// WEBPACK FOOTER //
// ./src/containers/WorkbookPage/Workbook.js