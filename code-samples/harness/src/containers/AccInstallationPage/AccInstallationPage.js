import React from 'react'
import { asyncPoll, Utils, PageBreadCrumbs, createPageContainer } from 'components'

import AcctInstallationCardView from './views/AcctInstallationCardView'
import DelegateScopeModal from './DelegateScopeModal'
import DelegateScopeAddModal from './DelegateScopeAddModal'
import css from './AccInstallationPage.css'
import apis from 'apis/apis'
import { DelegatesService } from 'services'

// const fragmentArr = [{ delegates: [] }]
// ---------------------------------------- //

class AccInstallationPage extends React.Component {
  // TODO: propTypes
  state = {
    delegates: [],
    downloadLink: null,
    delegateScopeAddModalShow: false,
    delegateScopeModalShow: false,
    delegateScopeModalData: null
  }
  acctId = this.props.urlParams.accountId // Utils.accountIdFromUrl()
  selectedDelegate
  selectedDelegateAction
  title = this.renderTitleBreadCrumbs()
  pageName = 'Installations'
  pollingFetchDone = false
  get header () {
    // header is optional.
    return (
      <div className={css.headerBar}>
        <a target="_blank" href={this.state.downloadLink} className={`wings-text-link ${css.downloadLink}`}>
          <i className="icons8-installing-updates-2 icon" />
          <span>Download Delegate Zip</span>
        </a>
      </div>
    )
  }

  onPollInterval = Utils.debounce(
    async () => {
      if (this.pollingFetchDone) {
        this.pollingFetchDone = false
        await this.fetchData()
      } else {
        console.log('Polling... Last fetching has not been done! ')
      }
    },
    500,
    true
  )
  AcctInstallationCardViewWithPolling = asyncPoll(5 * 1000, this.onPollInterval)(AcctInstallationCardView)

  async componentDidMount () {
    await this.generateDownloadUrl()
  }

  fetchData = async () => {
    const { accountId } = this.props.urlParams
    const { delegates } = await DelegatesService.getDelegatesByAccount({ accountId })
    this.setState({ delegates })
  }

  generateDownloadUrl = async () => {
    if (!this.state.downloadLink) {
      const { url, error } = await Utils.getDownloadUrl(apis.getDelegatesDownloadUrl(this.acctId))

      if (error) {
        console.error(error) // TODO: Use Toasts (i.e: http://blueprintjs.com/docs/#core/components/toast)
      }

      this.setState({ downloadLink: url || '#' })
    }
  }

  renderTitleBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const bData = [{ label: 'Setup', link: path.toSetup(urlParams) }, { label: 'Installations', nonHeader: true }]
    return <PageBreadCrumbs data={bData} />
  }

  onAddScope = (delegate, hasScope, action) => {
    this.selectedDelegate = delegate
    this.selectedDelegateAction = action
    this.setState({ delegateScopeAddModalShow: true })
  }

  onEditScope = (delegate, hasScope, scope, action) => {
    this.selectedDelegate = delegate
    this.selectedDelegateAction = action
    // if (hasScope) {
    //   // edit scope
    //   let scope
    //   if (delegate.includeScopes && delegate.includeScopes.length > 0) {
    //     scope = delegate.includeScopes[0] // TODO: allow edit multiple scopes
    //     scope.includeOrExclude = 'INCLUDE'
    //   } else if (delegate.excludeScopes && delegate.excludeScopes.length > 0) {
    //     scope = delegate.excludeScopes[0] // TODO: allow edit multiple scopes
    //     scope.includeOrExclude = 'EXCLUDE'
    //   }
    //   this.setState({
    //     delegateScopeModalShow: true,
    //     delegateScopeModalData: scope
    //   })
    // }
    this.setState({
      delegateScopeModalShow: true,
      delegateScopeModalData: scope
    })
  }

  toIdArrays = delegate => {
    let includeScopes = Utils.getJsonValue(delegate, 'includeScopes') || []
    includeScopes = includeScopes.map(item => (item ? item.uuid : '')) // convert to array of 'IDs'
    let excludeScopes = Utils.getJsonValue(delegate, 'excludeScopes') || []
    excludeScopes = excludeScopes.map(item => (item ? item.uuid : '')) // convert to array of 'IDs'
    return { includeScopes, excludeScopes }
  }

  onDeleteScope = async (delegate, scope, action) => {
    const accountId = this.props.urlParams.accountId
    const { includeScopes, excludeScopes } = this.toIdArrays(delegate)

    if (action === 'INCLUDE' && includeScopes.length > 0) {
      const idx = includeScopes.indexOf(scope.uuid)
      if (idx > -1) {
        includeScopes.splice(idx, 1)
      }
      // await DelegatesService.deleteScope(accountId, delegate.includeScopes[0].uuid)
    }
    if (action === 'EXCLUDE' && excludeScopes.length > 0) {
      const idx = excludeScopes.indexOf(scope.uuid)
      if (idx > -1) {
        excludeScopes.splice(idx, 1)
      }
      // await DelegatesService.deleteScope(accountId, delegate.excludeScopes[0].uuid)
    }
    await DelegatesService.updateDelegateScopes(accountId, delegate.uuid, includeScopes, excludeScopes)
    // delegate.includeScopes = null
    // delegate.excludeScopes = null
    // await DelegatesService.updateDelegate(accountId, delegate.uuid, delegate)
    // await DelegatesService.updateDelegateScopes(accountId, delegate.uuid, null, null)
    this.fetchData()
  }

  onAddScopeSubmit = async formData => {
    this.setState({ delegateScopeAddModalShow: false })
    console.log('submitted: ', formData)

    if (formData.select === 'NEW') {
      this.setState({ delegateScopeModalShow: true })
    } else {
      const accountId = this.props.urlParams.accountId
      const { includeScopes, excludeScopes } = this.toIdArrays(this.selectedDelegate)

      if (this.selectedDelegateAction === 'INCLUDE') {
        includeScopes.push(formData.existingScopeId)
      } else if (this.selectedDelegateAction === 'EXCLUDE') {
        excludeScopes.push(formData.existingScopeId)
      }
      await DelegatesService.updateDelegateScopes(accountId, this.selectedDelegate.uuid, includeScopes, excludeScopes)
      this.fetchData()
    }
  }

  onDelegateScopeSubmit = async formData => {
    const accountId = this.props.urlParams.accountId
    const isEditing = formData.uuid ? true : false
    // TODO: support multi-selection. At this time, we're using 1-item arrays:
    const data = {
      name: formData.name || '',
      taskTypes: formData.taskTypes ? [formData.taskTypes] : [],
      environmentTypes: formData.environmentTypes ? [formData.environmentTypes] : [],
      environments: formData.environments ? [formData.environments] : [],
      applications: formData.applications ? [formData.applications] : [],
      serviceInfrastructures: formData.serviceInfrastructures ? [formData.serviceInfrastructures] : []
    }
    if (isEditing) {
      // EDITING
      data.uuid = formData.uuid
      data.accountId = formData.accountId
      data.appId = formData.appId
      await DelegatesService.updateScope(accountId, data.uuid, data)
    } else {
      // NEW
      const { scope, error } = await DelegatesService.createScope(accountId, data)
      if (error) {
        return
      }
      const { includeScopes, excludeScopes } = this.toIdArrays(this.selectedDelegate)
      if (this.selectedDelegateAction === 'INCLUDE') {
        includeScopes.push(scope.uuid) // [scope.uuid]
      } else if (this.selectedDelegateAction === 'EXCLUDE') {
        excludeScopes.push(scope.uuid) // [scope.uuid]
      }
      const { error: updateError } = await DelegatesService.updateDelegateScopes(
        accountId,
        this.selectedDelegate.uuid,
        includeScopes,
        excludeScopes
      )
      if (updateError) {
        return
      }
    }

    this.setState({
      delegateScopeModalShow: false,
      delegateScopeModalData: null
    })
    this.fetchData()
  }

  render () {
    const delegates = Utils.getJsonValue(this, 'state.delegates') || []
    const AcctInstallationCardViewWithPolling = this.AcctInstallationCardViewWithPolling
    const widgetViewParams = {
      data: delegates,
      downloadLink: this.state.downloadLink
    }
    return (
      <section className={'content ' + css.main}>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <AcctInstallationCardViewWithPolling
                params={widgetViewParams}
                delegates={delegates}
                onAddScope={this.onAddScope}
                onEditScope={this.onEditScope}
                onDeleteScope={this.onDeleteScope}
              />
            </div>
          </div>
        </section>
        {this.state.delegateScopeAddModalShow &&
          <DelegateScopeAddModal
            {...this.props}
            show={this.state.delegateScopeAddModalShow}
            onHide={() => this.setState({ delegateScopeAddModalShow: false })}
            onSubmit={this.onAddScopeSubmit}
          />}
        <DelegateScopeModal
          {...this.props}
          show={this.state.delegateScopeModalShow}
          data={this.state.delegateScopeModalData}
          onHide={() => this.setState({ delegateScopeModalShow: false })}
          onSubmit={this.onDelegateScopeSubmit}
        />
      </section>
    )
  }
}

export default createPageContainer()(AccInstallationPage)



// WEBPACK FOOTER //
// ../src/containers/AccInstallationPage/AccInstallationPage.js