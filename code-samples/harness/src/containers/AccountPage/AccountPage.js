import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Utils } from 'components'
import apis from 'apis/apis'
import css from './AccountPage.css'
import AccountConnectorView from './views/AccountConnectorView'
import AccountCatalogView from './views/AccountCatalogView'
import AccountUserView from './views/AccountUserView'
import AccountWingsInstallationView from './views/AccountWingsInstallationView'
import AccountNotificationGroupView from './views/AccountNotificationGroupView'
import AccountCloudProviderView from './views/AccountCloudProviderView'

const fragmentArr = [
  { settings: [] }
  // will be set later
]

class AccountPage extends React.Component {

  componentWillMount () {
    this.fetchData()
    this.props.onPageWillMount(<h3 className="wings-page-header">Account</h3>, 'Account')
  }

  fetchData = () => {
    fragmentArr[0].settings = [ apis.fetchOrgSettings ]
    if (__CLIENT__ ) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }
  }

  render () {
    return (
      <section className={css.main}>
        <section className="content-header">
          <div className={css.heading}>&nbsp;</div>
        </section>
        <section className="content">
          <div className="row wings-card-row">
            <div className="__accountCards">

              <div className="col-md-8 col-md-offset-2 wings-card-col">
                <AccountCloudProviderView />
              </div>
              <div className="col-md-8 col-md-offset-2 wings-card-col">
                <AccountConnectorView />
              </div>
              <div className="col-md-8 col-md-offset-2 wings-card-col">
                <AccountCatalogView />
              </div>
              <div className="col-md-8 col-md-offset-2 wings-card-col">
                <AccountUserView />
              </div>
              <div className="col-md-8 col-md-offset-2 wings-card-col">
                <AccountNotificationGroupView />
              </div>
              <ReactCSSTransitionGroup transitionName="slide"
                component="div"
                className="__transitionContainer"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={0}>
                { this.state.showMore &&
                  <div>

                    <div className="col-md-8 col-md-offset-2 wings-card-col">
                      <AccountWingsInstallationView />
                    </div>
                    {/* more item... */}
                  </div>
                }

                { !this.state.showMore &&
                    <div className="col-md-8 col-md-offset-2 wings-card-col">
                      <div className="__more" onClick={(e) => this.setState({ showMore: true })}>
                        <div className="__moreIcon"> <i className="icons8-expand-arrow" /> </div>
                        <div className="__moreText"> More </div>
                      </div>
                    </div>
                }
              </ReactCSSTransitionGroup>


            </div>
          </div>
        </section>
      </section>
    )
  }

}

export default Utils.createTransmitContainer(AccountPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/AccountPage/AccountPage.js