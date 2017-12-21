// @flow
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import type { RouterHistory } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import invariant from 'invariant';
import type { Id } from '@sigmacomputing/sling';

import { decodeDashboardUrl, encodeWorksheetUrl } from 'utils/url';
import MoveModal from 'containers/Library/MoveModal';
import DashboardModal from 'components/DashboardModal';
import TextTileContainer from './TextTileContainer';
import Header from 'components/nav/Header';
import { Box, Menu, Checkbox, TextSpan } from 'widgets';
import genId from 'utils/uuid62';
import {
  DashboardFragment,
  mapDashboard,
  updateDashboardContent,
  updateTitle
} from 'api/dashboard';
import type {
  DashboardDetailsTy,
  DashboardSettingsTy,
  RefetchSettingsTy
} from 'types';

import { calcNewTilePos, Tile, TileGrid, type TileLayout } from './TileGrid';
import RefreshModal from './RefreshModal';
import DashTile from './DashTile';
import DashboardToolbar from './DashToolbar';
import EmptyDashboard from './EmptyDashboard';
import TileFetcher from './TileFetcher';

const DUMMY_FUNC = (() => null: any);
const { MenuItem } = Menu;

export type ChartTile = {|
  type: 'chart',
  wsId: Id,
  chartId: Id
|};

export type TextTile = {|
  type: 'text',
  contents: string
|};

export type TypedTile = ChartTile | TextTile;

export type DashboardTile = {|
  id: Id,
  layout: TileLayout,
  def: TypedTile,
  settings: ?{ refetchSettings: RefetchSettingsTy }
|};

type Props = {|
  dashboard: DashboardDetailsTy,
  history: RouterHistory,
  rename?: string => void,
  updateTiles?: ({ [Id]: DashboardTile }) => void,
  updateSettings?: DashboardSettingsTy => void
|};

class Dashboard extends Component<
  Props,
  {|
    isLocked: boolean,
    refreshTileId: ?Id,
    showChartSelector: boolean,
    showMoveModal: boolean,
    showRefreshModal: boolean
  |}
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLocked: false,
      refreshTileId: null,
      showChartSelector: false,
      showMoveModal: false,
      showRefreshModal: false
    };
  }

  handleOpenWorksheet = wsId => {
    this.props.history.push(encodeWorksheetUrl(wsId, ''));
  };

  onAddTiles = (tiles: Array<DashboardTile>) => {
    const { dashboard, updateTiles } = this.props;
    if (!updateTiles) return;

    const newTiles = { ...dashboard.tiles };
    tiles.forEach(tile => {
      newTiles[tile.id] = tile;
    });
    updateTiles(newTiles);
  };

  handleLayoutChange = (layout: { [Id]: TileLayout }) => {
    const { dashboard, updateTiles } = this.props;
    if (!updateTiles) return;

    const newTiles = { ...dashboard.tiles };
    Object.keys(layout).forEach(id => {
      const oldTile = newTiles[id];
      newTiles[id] = {
        ...oldTile,
        layout: layout[id]
      };
    });
    updateTiles(newTiles);
  };

  updateTitle = (title: string) => {
    const { rename } = this.props;
    if (!rename) return;

    rename(title);
  };

  newTileLayouts(sizes: Array<{ w: number, h: number }>): Array<TileLayout> {
    const { tiles } = this.props.dashboard;
    const curLayout = Object.keys(tiles).map(id => tiles[id].layout);
    const newLayouts = [];
    sizes.forEach(({ w, h }, i) => {
      const { x, y } = calcNewTilePos(curLayout.concat(newLayouts));
      newLayouts[i] = { x, y, w, h };
    });
    return newLayouts;
  }

  addCharts = (wsId: Id, chartIds: Array<Id>) => {
    const sizes = chartIds.map(() => ({ w: 6, h: 6 }));
    const layouts = this.newTileLayouts(sizes);
    this.onAddTiles(
      chartIds.map((chartId, i) => ({
        id: genId(),
        layout: layouts[i],
        def: {
          type: 'chart',
          wsId,
          chartId
        },
        settings: null
      }))
    );
    this.closeChartSelector();
  };

  addText = () => {
    const sizes = [{ w: 6, h: 6 }];
    this.onAddTiles(
      this.newTileLayouts(sizes).map(layout => {
        const id = genId();
        return {
          id,
          layout,
          def: {
            type: 'text',
            contents: ''
          },
          settings: null
        };
      })
    );
  };

  handleTileDelete = (tileId: Id) => {
    const { dashboard, updateTiles } = this.props;
    if (!updateTiles) return;

    const tiles = { ...dashboard.tiles };
    delete tiles[tileId];
    updateTiles(tiles);
  };

  handleToggleLocked = () => {
    this.setState({ isLocked: !this.state.isLocked });
  };

  openChartSelector = () => {
    this.setState({ showChartSelector: true });
  };

  closeChartSelector = () => {
    this.setState({ showChartSelector: false });
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

  onCloseRefreshModal = () => {
    this.setState({
      showRefreshModal: false
    });
  };

  onOpenRefreshModal = (tileId: ?Id) => {
    this.setState({
      refreshTileId: tileId,
      showRefreshModal: true
    });
  };

  onSubmitRefreshModal = (refetchSettings: RefetchSettingsTy) => {
    const { dashboard, updateSettings, updateTiles } = this.props;
    if (!updateSettings || !updateTiles) return;
    this.onCloseRefreshModal();

    const { refreshTileId } = this.state;
    if (refreshTileId) {
      const newTile = {
        ...dashboard.tiles[refreshTileId],
        settings: { refetchSettings }
      };
      const tiles = {
        ...dashboard.tiles,
        [refreshTileId]: newTile
      };
      updateTiles(tiles);
    } else {
      updateSettings({ refetchSettings });
    }
  };

  handleContentUpdate = (tileId: Id, contents: string) => {
    const { dashboard, updateTiles } = this.props;
    if (!updateTiles) return;

    const newTile = {
      ...dashboard.tiles[tileId],
      def: {
        type: 'text',
        contents
      }
    };
    const tiles = {
      ...dashboard.tiles,
      [tileId]: newTile
    };
    updateTiles(tiles);
  };

  renderTile = (tileId: Id) => {
    const { tiles, settings } = this.props.dashboard;
    const tile = tiles[tileId];
    const refetchSettings =
      tile.settings && tile.settings.refetchSettings.useDash === false
        ? tile.settings.refetchSettings
        : settings && settings.refetchSettings;

    switch (tile.def.type) {
      case 'chart':
        return <TileFetcher tile={tile} refetchSettings={refetchSettings} />;
      case 'text':
        return (
          <TextTileContainer
            tileId={tileId}
            content={tile.def.contents}
            onContentUpdate={this.handleContentUpdate}
          />
        );
      default:
        throw new Error(`Unknown tile type: ${tile.def.type}`);
    }
  };

  renderTiles = () => {
    const { canEdit, tiles } = this.props.dashboard;
    return Object.keys(tiles).map(tileId => {
      const tile = tiles[tileId];
      return (
        <Tile key={tileId} data-grid={tile.layout}>
          <DashTile
            onOpen={this.handleOpenWorksheet}
            onDelete={this.handleTileDelete}
            onOpenRefreshModal={canEdit ? this.onOpenRefreshModal : null}
            renderContents={this.renderTile}
            tile={tiles[tileId]}
          />
        </Tile>
      );
    });
  };

  onMenuClick = (action: string) => {
    switch (action) {
      case 'folder':
        this.showMoveModal();
        break;
      case 'text':
        this.addText();
        break;
      case 'save':
        break;
      default:
        break;
    }
  };

  renderMenuActions() {
    const { dashboard } = this.props;

    return (
      <Menu onMenuItemClick={this.onMenuClick}>
        <MenuItem id="folder" disabled={!dashboard.canEdit} name="Move" />
        {/*<MenuItem id="save">Save Copy</MenuItem>*/}
      </Menu>
    );
  }

  renderActions() {
    const { isLocked } = this.state;
    return (
      <div>
        <Checkbox checked={isLocked} onChange={this.handleToggleLocked}>
          <TextSpan font="header5">{isLocked ? 'Locked' : 'Unlocked'}</TextSpan>
        </Checkbox>
      </div>
    );
  }

  render() {
    const { dashboard } = this.props;
    const { tiles, settings } = dashboard;
    const {
      isLocked,
      showChartSelector,
      showMoveModal,
      showRefreshModal,
      refreshTileId
    } = this.state;
    let refetchSettings = settings && settings.refetchSettings;

    if (refreshTileId) {
      refetchSettings =
        tiles[refreshTileId].settings &&
        tiles[refreshTileId].settings.refetchSettings;
    }

    return (
      <Box
        css={`
          min-height: 100vh;
          overflow: hidden;
          padding-top: 56px;
        `}
        bg="darkBlue6"
      >
        <Header
          title={dashboard.name}
          folder={dashboard.folder}
          onRename={this.updateTitle}
          actions={this.renderActions()}
          menu={this.renderMenuActions()}
          onSendInvites={DUMMY_FUNC}
        />
        <Helmet title={`Dashboard - Sigma`} />
        <DashboardToolbar
          onAddCharts={this.openChartSelector}
          onAddText={this.addText}
          onOpenRefreshModal={
            dashboard.canEdit ? this.onOpenRefreshModal : null
          }
        />
        {Object.keys(dashboard.tiles).length === 0 && <EmptyDashboard />}
        <TileGrid
          isLocked={isLocked}
          onLayoutChange={this.handleLayoutChange}
          renderTiles={this.renderTiles}
        />
        {showRefreshModal && (
          <RefreshModal
            tileId={refreshTileId}
            title={
              refreshTileId
                ? 'Refresh Settings for Tile'
                : 'Dashboard Refresh Settings'
            }
            refetchSettings={refetchSettings}
            onSubmit={this.onSubmitRefreshModal}
            onClose={this.onCloseRefreshModal}
          />
        )}
        {showChartSelector && (
          <DashboardModal
            onAddCharts={this.addCharts}
            onClose={this.closeChartSelector}
          />
        )}
        {showMoveModal && (
          <MoveModal
            currentFolderId={dashboard.folder.inodeId}
            inodeId={dashboard.inodeId}
            onClose={this.hideMoveModal}
          />
        )}
      </Box>
    );
  }
}

type ContainerProps = {|
  data: ?{
    dashboard: DashboardDetailsTy,
    orgName: string
  },
  history: RouterHistory,
  loading: boolean
|};

class DashboardContainer extends Component<ContainerProps> {
  updateTiles = (tiles: { [Id]: DashboardTile }) => {
    const { data } = this.props;
    invariant(data != null, 'Missing data for dashboard');
    updateDashboardContent(
      data.dashboard.inodeId,
      tiles,
      data.dashboard.settings
    );
  };

  updateSettings = (settings: DashboardSettingsTy) => {
    const { data } = this.props;
    invariant(data != null, 'Missing data for dashboard');
    updateDashboardContent(
      data.dashboard.inodeId,
      data.dashboard.tiles,
      settings
    );
  };

  rename = (name: string) => {
    const { data } = this.props;
    invariant(data != null, 'Missing data for dashboard');
    updateTitle(data.dashboard.inodeId, name);
  };

  render() {
    const { data, history, loading } = this.props;
    if (loading) return null;

    invariant(data != null, 'Missing data for dashboard');
    const { canEdit } = data.dashboard;

    return (
      <Dashboard
        dashboard={data.dashboard}
        history={history}
        rename={canEdit ? this.rename : undefined}
        updateTiles={canEdit ? this.updateTiles : undefined}
        updateSettings={canEdit ? this.updateSettings : undefined}
      />
    );
  }
}

const DashboardQuery = gql`
  query GetDashboard($dashboardId: UUID!) {
    organization {
      dashboard(id: $dashboardId) {
        ...DashboardFragment
      }
    }
  }
  ${DashboardFragment}
`;

const DashboardPage = graphql(DashboardQuery, {
  options: ({ match: { url } }) => ({
    variables: {
      dashboardId: decodeDashboardUrl(url)
    }
  }),
  props: ({ ownProps, data: { loading, organization } }) => {
    const data = loading
      ? null
      : {
          dashboard: mapDashboard(organization.dashboard)
        };

    return {
      ...ownProps,
      data,
      loading
    };
  }
})(DashboardContainer);

export default DashboardPage;



// WEBPACK FOOTER //
// ./src/containers/Dashboard/index.js