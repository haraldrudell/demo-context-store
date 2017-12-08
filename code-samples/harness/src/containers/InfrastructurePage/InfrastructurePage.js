import React from 'react'
import { Widget, Utils } from 'components'
import apis from 'apis/apis'
import OrgSettingCardView from './views/OrgSettingCardView'
import OrgSettingListView from './views/OrgSettingListView'
import css from './InfrastructurePage.css'

const fragmentArr = [
  { data: [] } // will be set later
]

export default class InfrastructurePage extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()

  state = { data: {}, showModal: false, modalData: {} }

  componentWillMount () {
    this.fetchData()
    Utils.loadChildContextToState(this, 'app')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  fetchData = () => {
    fragmentArr[0].data = [ apis.fetchOrgSettings, Utils.appIdFromUrl() ] // Utils.appIdFromUrl() ]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  WidgetHeader = null
  // WidgetHeader = (props) => (
  //   <button className="btn btn-link" onClick={Utils.showModal.bind(this, null)}>
  //     <i className="icons8-plus-math"></i> Add Setting
  //   </button>)

  render () {
    const widgetViewParams = {
      data: this.state.data.resource.response,
      onEdit: Utils.showModal.bind(this),
      onDelete: this.onDelete
    }

    return (
      <section className={css.main}>
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="box-solid wings-card">

                <div className="box-header with-border">
                  <span className="light">ORGANIZATION SETTINGS</span>
                  <div className="wings-card-actions">
                  </div>
                </div>

                <div className="box-body">

                  <Widget title="" headerComponent={this.WidgetHeader}
                    views={[{
                      name: '',
                      icon: 'fa-th-large',
                      component: OrgSettingCardView,
                      params: widgetViewParams
                    },
                    {
                      name: '',
                      icon: 'fa-th-list',
                      component: OrgSettingListView,
                      params: widgetViewParams
                    }
                    ]}
                  ></Widget>

                </div>
              </div>
            </div>
          </div>
        </section>

      </section>
    )
  }
}




// WEBPACK FOOTER //
// ../src/containers/InfrastructurePage/InfrastructurePage.js