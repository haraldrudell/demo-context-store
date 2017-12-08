import React from 'react'
import {
  UIButton,
  ConfirmDelete,
  NotificationGroupModal,
  Widget,
  PageBreadCrumbs,
  Utils,
  createPageContainer
} from 'components'
import AcctNotificationGroupCardView from './views/AcctNotificationGroupCardView'
import css from './AcctNotificationGroupPage.css'
import apis from 'apis/apis'

const fragmentArr = [{ notificationGroups: [] }]

class AcctNotificationGroupPage extends React.Component {
  state = {
    showModal: false,
    modalData: null,
    showConfirm: false
  }
  appId = Utils.appIdFromUrl()
  acctId = Utils.accountIdFromUrl()
  title = this.renderTitleBreadCrumbs()
  pageName = 'Notification Groups'

  componentWillMount () {
    this.fetchData()
  }

  fetchData = () => {
    fragmentArr[0].notificationGroups = [apis.fetchNotificationGroups, this.appId]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, () => {})
    } else {
      this.setState(this.props)
    }
  }

  renderTitleBreadCrumbs () {
    const path = this.props.path
    const urlParams = this.props.urlParams
    const bData = [{ label: 'Setup', link: path.toSetup(urlParams) }, { label: 'Notification Groups', nonHeader: true }]
    return <PageBreadCrumbs data={bData} />
  }

  onAddClick = () => {
    this.setState({ showModal: true, modalData: null })
  }

  onEditClick = item => {
    this.setState({ showModal: true, modalData: item })
  }

  onGroupAdded = () => {
    this.setState({ showModal: false, modalData: null })
    this.fetchData()
  }

  onDeleteClick = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {
    apis.deleteNotificationGroup(this.state.deletingId).then(res => {
      this.fetchData()
    })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  widgetHeader = props => {
    return (
      <div className="add-icon">
        <UIButton icon="Add" medium onClick={this.onAddClick.bind(this)}>
          Add Notification Group
        </UIButton>
      </div>
    )
  }

  render () {
    const notificationGroups = Utils.getJsonValue(this, 'state.notificationGroups.resource.response') || []
    const widgetViewParams = {
      data: notificationGroups,
      onEdit: this.onEditClick,
      onDelete: this.onDeleteClick
    }
    const headerParams = {
      leftItem: this.widgetHeader(),
      showSearch: false
    }
    return (
      <section className={css.main}>
        <Widget
          {...this.props}
          title=""
          headerParams={headerParams}
          views={[
            {
              name: '',
              component: AcctNotificationGroupCardView,
              params: widgetViewParams
            }
          ]}
        />

        <NotificationGroupModal
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          data={this.state.modalData}
          onSubmit={this.onGroupAdded}
        />
        <ConfirmDelete
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
        />
      </section>
    )
  }
}

export default createPageContainer()(AcctNotificationGroupPage)



// WEBPACK FOOTER //
// ../src/containers/AcctNotificationGroupPage/AcctNotificationGroupPage.js