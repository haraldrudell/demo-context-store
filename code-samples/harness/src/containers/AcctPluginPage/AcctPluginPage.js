import React from 'react'
import { Confirm, Utils, AppStorage, BreadCrumbs } from 'components'
import AcctPluginCardViewPage from './views/AcctPluginCardViewPage'
import apis from 'apis/apis'
import css from './AcctPluginPage.css'

const fragmentArr = [
  { data: [] } // will be set later
]
// ---------------------------------------- //

class AcctPluginPage extends React.Component {
  // TODO: propTypes
  state = { data: {}, showModal: false, modalData: {} }
  acctId = AppStorage.get('acctId')

  componentWillMount () {
    this.fetchData()
    this.props.onPageWillMount(<h3>Account</h3>)
  }

  fetchData = () => {
    fragmentArr[0].data = [ apis.fetchPlugins ]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
      this.state.data.resource = this.state.data.resource || [] // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  onSubmit = (data, isEditing) => {


  }

  onDelete = (uuid) => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {

    this.setState({ showConfirm: false, deletingId: '' })
  }

  WidgetHeader = (props) => (
    <span>
      <button className="btn btn-link wings-add-new" onClick={Utils.showModal.bind(this, null)}>
        <div className="wings-add-new-icon"><i className="icons8-plus-filled"></i></div>
        Add Plugin
      </button>
    </span>)

  renderBreadCrumbs () {
    const bData = [ { label: 'Account', link: '/account' },
      { label: 'Connector', link: '/account/connector' },
      { label: 'Connector Plugins' }
    ]
    return <BreadCrumbs data={bData} />
  }

  render () {
    const widgetViewParams = {
      data: Utils.getJsonValue(this, 'state.data.resource') || [],
      onEdit: Utils.showModal.bind(this),
      onDelete: this.onDelete
    }
    return (
      <section className={css.main}>
        <section className="content-header">
          {this.renderBreadCrumbs()}
        </section>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <AcctPluginCardViewPage params={widgetViewParams} />
            </div>
          </div>
        </section>


        <Confirm
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
          body="Are you sure you want to delete this?"
          confirmText="Confirm Delete"
          title="Deleting">
          <button style={{ display: 'none' }} />
        </Confirm>
      </section>
    )
  }
}

export default Utils.createTransmitContainer(AcctPluginPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/AcctPluginPage/AcctPluginPage.js