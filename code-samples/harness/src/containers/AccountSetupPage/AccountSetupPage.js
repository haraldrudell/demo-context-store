import React from 'react'
import { observer } from 'mobx-react'
import { createPageContainer } from 'components'
import css from './AccountSetupPage.css'
import { Utils, AppStorage, Confirm, PageBreadCrumbs, FormUtils } from 'components'
import { Link } from 'react-router'
import AppCardActions from '../ApplicationPage/views/AppCardActions'
import ApplicationModal from '../ApplicationPage/ApplicationModal'
import { ApplicationService } from 'services'

@observer
class AccountSetupPage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  state = {
    showAppModal: false,
    modalData: null,
    applications: [],
    showConfirm: false,
    deletingId: null,
    selectedAppName: null,
    searchText: ''
  }
  title = this.renderBreadCrumbs()
  pageName = 'Setup Account'

  async componentWillMount () {
    await this.props.dataStore.fetchAllApps()
  }

  renderSetupGuideContent = () => {
    {
      /* made it as unclickable for now  has to be
    fixed->setup guides has to be fixed */
    }
    return (
      <div className={`${css.cardContent}`}>
        <div className={css.category}>
          <span className="wings-text-link">
            <i className={`icons8-help-filled ${css.icon} ${css.setupGuideIcon}`} />
            <span className={`${css.iconName} ${css.setupGuideIcon}`}>Application Setup Guide</span>
          </span>
        </div>
        <div className={css.category}>
          <span className="wings-text-link">
            <i className={`icons8-help-filled ${css.icon} ${css.setupGuideIcon}`} />
            <span className={`${css.iconName} ${css.setupGuideIcon}`}>Service Setup Guide</span>
          </span>
        </div>
        <div className={css.category}>
          <span className="wings-text-link">
            <i className={`icons8-help-filled ${css.icon} ${css.setupGuideIcon}`} />
            <span className={`${css.iconName} ${css.setupGuideIcon}`}>Environment Setup Guide</span>
          </span>
        </div>
        <div className={css.category}>
          <span className="wings-text-link">
            <i className={`icons8-help-filled ${css.icon} ${css.setupGuideIcon}`} />
            <span className={`${css.iconName} ${css.setupGuideIcon}`}>Artifact Stream Setup Guide</span>
          </span>
        </div>
        <div className={css.category}>
          <span className="wings-text-link">
            <i className={`icons8-help-filled ${css.icon} ${css.setupGuideIcon}`} />
            <span className={`${css.iconName} ${css.setupGuideIcon}`}>Pipeline Setup Guide</span>
          </span>
        </div>
      </div>
    )
  }

  renderAccountContent = () => {
    const accountId = AppStorage.get('acctId')
    return (
      <div className={`box-body wings-card-body ${css.cardContent}`}>
        <div className={css.category} data-name="cloud-providers-menu">
          <Link to={`/account/${accountId}/cloud-providers`}>
            <span className="wings-text-link">
              <i className={`icons8-cloud ${css.icon}`} />
              <span className={css.iconName}>Cloud Providers</span>
            </span>
          </Link>
        </div>
        <div className={css.category} data-name="connectors-menu">
          <Link to={`/account/${accountId}/connector`}>
            <span className="wings-text-link">
              <i className={`icons8-settings-2 ${css.icon}`} />
              <span className={css.iconName}> Connectors </span>
            </span>
          </Link>
        </div>

        <div className={css.category} data-name="notification-groups">
          <Link to={`/account/${accountId}/notification-groups`}>
            <span className="wings-text-link">
              <i className={`icons8-user-groups ${css.icon}`} />
              <span className={css.iconName}> Notification Groups</span>
            </span>
          </Link>
        </div>
        <div className={css.category} data-name="catalogs-menu">
          <Link to={`/account/${accountId}/catalogs`}>
            <span className="wings-text-link">
              <i className={`icons8-user-groups ${css.icon}`} />
              <span className={css.iconName}> Catalogs</span>
            </span>
          </Link>
        </div>

        <div className={css.category} data-name="delegates-menu">
          <Link to={`/account/${accountId}/installation`}>
            <span className="wings-text-link">
              <i className={`icons8-software-installer ${css.icon}`} />
              <span className={css.iconName}>Harness Installations</span>
            </span>
          </Link>
        </div>
      </div>
    )
  }
  // To Sort Applications
  sortData = (data, order) => {
    if (data && data.length >= 1) {
      return Utils.sortDataByKey(data, 'name', order)
    }
  }

  searchApplication = async e => {
    this.setState({ searchText: e.target.value })
  }
  /* Removed the logic of filtering apps by calling backend
    instead doing at client side
   */
  filterAppsBySearchText = () => {
    let filteredApps = []
    const searchText = this.state.searchText
    const apps = FormUtils.clone(this.props.dataStore.apps)
    if (searchText) {
      filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchText.toLowerCase()))
    }
    return filteredApps
  }
  /* if searchtext is not empty -> just show the list of apps
  else show filteredApps List
  */
  getAppsList = () => {
    if (!this.state.searchText) {
      return this.props.dataStore.apps
    } else {
      return this.filterAppsBySearchText()
    }
  }

  renderApps = params => {
    const apps = this.getAppsList()
    const sortedData = this.sortData(apps, 'ASC')
    if (sortedData) {
      return (
        <div className={`${css.applicationDiv}`}>
          <div className={css.borderBottom} />
          {sortedData.map((app, index) => {
            return (
              <div data-name={app.name} className={css.appDetails} data-description={app.description} key={index}>
                <span className={`${css.iconHolder} addBorder`}>
                  <i className={`icons8-code ${css.icon}`} />
                </span>
                <div className={css.appName}>
                  <span className={`wings-text-link ${css.applicationName} `} onClick={() => this.onNameClick(app)}>
                    {app.name} &nbsp;{this.renderDescription(app.description)}
                  </span>
                  <ui-card-actions>
                    <AppCardActions {...this.props} app={app} params={params} />
                  </ui-card-actions>
                </div>
              </div>
            )
          })}
        </div>
      )
    } else if (this.state.searchText || this.state.searchText === '') {
      /*
        When searchtext is empty string ("")
        not to show the no applications message
      */
      return null
    } else {
      return this.renderNoApplicationsMessage()
    }
  }
  renderNoApplicationsMessage = () => {
    return (
      <main className={`no-data-box ${css.noAppsMessage}`}>
        There are no Applications.
        <span
          className="wings-text-link cta-button"
          onClick={() => {
            this.onAddClick.call(this)
          }}
        >
          Add Application
        </span>
      </main>
    )
  }
  renderDescription = description => {
    if (description) {
      return (
        <span className={css.appDescription}>
          ({description})
        </span>
      )
    }
  }

  onNameClick = app => {
    if (app) {
      const { accountId } = this.props.urlParams
      this.props.router.push(this.props.path.toAppDetails({ accountId, appId: app.uuid }))
    }
  }

  onSetupClick = app => {
    Utils.redirect({ appId: app.uuid, page: 'setup' })
  }
  onAddClick = () => {
    this.setState({ showAppModal: true, modalData: null })
    /* Utils.showModal.call(this, null)
    if (this.props.isTourOn && this.props.tourStage === TourStage.APPLICATION) {
      this.props.onTourPause()
    }*/
  }
  onHideModal = () => {
    this.setState({ showAppModal: false })
  }

  fetchApps = async () => {
    this.props.spinner.show()
    await this.props.dataStore.fetchAllApps()
    this.setState({ apps: this.props.dataStore.apps })
    this.props.spinner.hide()
  }
  onDelete = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = async () => {
    const { error } = await ApplicationService.deleteApplication(this.state.deletingId)
    if (error) {
      return
    } else {
      this.setState({ showConfirm: false, deletingId: '' })
      this.fetchApps()
    }
  }
  onEditClick = app => {
    this.setState({ showAppModal: true, modalData: app })
  }

  renderBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const bData = [{ label: 'Setup', link: path.toSetup(urlParams) }]
    return <PageBreadCrumbs data={bData} />
  }

  onSetupAsCodeClick = () => {
    const { accountId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupAsCode({ accountId }))
  }

  render () {
    const noDataCls = this.props.dataStore.apps.length === 0 ? css.paddingText : ''
    const params = {
      onDelete: this.onDelete,
      onEdit: this.onEditClick
    }
    return (
      <section className={'content' + ' ' + css.main}>
        <section className={`${css.applications}`}>
          <ui-card>
            <header>
              Applications
              <span
                data-name="add-application-button"
                className={`wings-text-link ${css.addBtn}`}
                onClick={this.onAddClick}
              >
                <i className="icon icons8-plus-math" />Add Application
              </span>
            </header>
            <main className={noDataCls}>
              <div className={`ui-card-search pt-input-group ${css.appSearch}`}>
                <input
                  className="pt-input"
                  placeholder="Search Application"
                  dir="auto"
                  onChange={this.searchApplication}
                />
                <span className="pt-icon pt-icon-search" />
              </div>
              {this.renderApps(params)}
            </main>
          </ui-card>
        </section>

        <section className={css.generalInfo}>
          <section className={css.setupAsCode}>
            <ui-card>
              <header>
                <span data-name="setup-as-code" className="wings-text-link" onClick={this.onSetupAsCodeClick}>
                  <i className="icons8-source-code" />
                  Configuration As Code
                </span>
              </header>
              <main />
            </ui-card>
          </section>
          <section className={`${css.account}`}>
            <ui-card>
              <header>Account</header>
              <main>
                {this.renderAccountContent()}
              </main>
            </ui-card>
          </section>
          <section className={`${css.setupguides}`}>
            <ui-card>
              <header> Setup Guides </header>
              <main>
                {this.renderSetupGuideContent()}
              </main>
            </ui-card>
          </section>
        </section>

        {/* isTourOn={this.props.isTourOn}*/}
        <ApplicationModal
          {...this.props}
          data={this.state.modalData}
          show={this.state.showAppModal}
          onHide={this.onHideModal}
          afterSubmit={this.fetchApps}
        />
        <Confirm
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
          body="Are you sure you want to delete this?"
          confirmText="Confirm Delete"
          title="Deleting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
      </section>
    )
  }
}
export default createPageContainer()(AccountSetupPage)



// WEBPACK FOOTER //
// ../src/containers/AccountSetupPage/AccountSetupPage.js