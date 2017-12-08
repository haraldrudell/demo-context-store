import React from 'react'
import { Link } from 'react-router'
import { ButtonToolbar, Button } from 'react-bootstrap'
import { AppsDropdown, UIButton, Widget, createPageContainer, NoDataCard, Utils } from 'components'
import TestComponents from './TestComponents'
import TestModal from './TestModal'
import TestDynamicModal from './TestDependencyModal'
import TestPageCardView from './TestPageCardView'
import { ApplicationService } from 'services'
import css from './TestPage.css'

// THIS TEST MODAL DEMONSTRATES:
//   TestPage, Page Layout & Styles, fetchData, spinner, Widget (Card List) & Search bar & NoData message,
//   TestModal, Add & Edit & Delete Item, App Picker, Toaster, urlParams, Living Style Guide (TestComponents)

class TestPage extends React.Component {
  state = {
    data: [],
    testUrlParams: false,
    testModalRegularActive: false,
    testModalDynamicActive: false,
    testModalData: {}
  }
  title = 'Dev Wiki' // required. String or component (<PageBreadCrumbs data={[{ label: 'Dev Wiki' }]} />).
  pageName = 'Dev Wiki' // pageName is optional (for Analytics tracking).
  get header () {
    // header is optional.
    return (
      <div className={css.pageHeader}>
        <AppsDropdown store={this.props.dataStore} />
      </div>
    )
  }

  fetchData = async () => {
    const { data, error } = await ApplicationService.dummyApiFetch(2000)
    if (!error) {
      this.setState({ data }) // after fetching, must set data to state.
    }
  }

  showRegularModal = (item = {}) => {
    // show Modal for New or Edit Item
    this.setState({ testModalRegularActive: true, testModalData: item })
  }

  showDynamicModal = item => {
    // show Modal for New or Edit Item
    if (item) {
      item.appId = this.props.dataStore.apps[0].uuid
      item.serviceId = 'S1'
      item.infraId = 'I2'
      item.customText = 'Hello World!'
      item.environmentMapping = {
        environment1: 'E1',
        service1: 'S1',
        environment2: 'E2',
        service2: 'S2'
      }
    }
    this.setState({ testModalDynamicActive: true, testModalData: item || null })
  }

  getWidgetParams = () => {
    const widgetHeaderParams = {
      leftItem: (
        <UIButton icon="Add" medium onClick={this.showRegularModal}>
          Add Item
        </UIButton>
      )
    }
    const widgetParams = {
      data: this.state.data, // widget data (array)
      // custom no-data message. (optional)
      noDataMessage: (
        <NoDataCard message="There is no data." buttonText="Add an Item" onClick={this.showRegularModal} />
      ),
      onNameClick: item => {},
      onEdit: item => this.showDynamicModal(item),
      onDelete: item => {
        this.props.confirm.showConfirmDelete(async () => {
          const error = null
          // Example: const { error } = await api.deleteItem(item.uuid)
          if (!error) {
            await this.props.refreshData()
            this.props.toaster.show({ message: 'Item deleted successfully.' })
          }
        })
      }
    }
    return { widgetHeaderParams, widgetParams }
  }

  renderUrlParamsTest = () => {
    const accountId = this.props.urlParams.accountId
    return (
      <div>
        {this.state.testUrlParams && (
          <pre>
            React Router Path Parameter: /:accountId = {this.props.params.accountId /* Don't use this one */}
            <br />
            <br />
            React Router Query Parameter: ?foo = {this.props.location.query.foo /* Don't use this one either */}
            <br />
            <br />
            Custom merge of both: <br />
            <br />
            {/* Prefer this awesome one to avoid tight coupling with route (better flexibility) */}
            accountId = {this.props.urlParams.accountId} <br />
            foo = {this.props.urlParams.foo}
            <br />
            <br />
            <Link to={this.props.path.toDevWiki({ accountId }, { foo: 'cool' })}>Cool Links Demo</Link>
            <br />
            <Link to={this.props.path.toDevWiki(this.props.urlParams, { foo: 'awesomesauce' })}>
              Awesome Links Demo
            </Link>
          </pre>
        )}
      </div>
    )
  }

  renderButtonBar = () => {
    return (
      <div>
        <ButtonToolbar>
          <Button bsStyle="primary" onClick={() => this.props.toaster.showError({ message: 'Test Toaster...' })}>
            Show Toaster
          </Button>
          <Button bsStyle="primary" onClick={this.showRegularModal}>
            Simple Form
          </Button>
          <Button bsStyle="primary" onClick={_ => this.showDynamicModal()}>
            Dependency Form
          </Button>
          <Button bsStyle="default" onClick={() => this.setState({ data: [] })}>
            Clear Data
          </Button>
        </ButtonToolbar>
        <p>&nbsp;</p>
        <ButtonToolbar>
          <Button onClick={() => this.props.spinner.show({ timeout: 5000 })}>Show Spinner</Button>
          <Button onClick={() => this.props.spinner.hide()}>Hide Spinner</Button>
          <Button onClick={() => this.setState({ testUrlParams: true })}>Test urlParams</Button>
        </ButtonToolbar>
      </div>
    )
  }

  render () {
    const { widgetHeaderParams, widgetParams } = this.getWidgetParams()
    const testDataProvider = async () => {
      await Utils.sleep(2000)
      return this.state.testModalData
    }

    return (
      <section className={'content ' + css.main}>
        <div className={css.body}>
          This is Test Page's Body.
          <Widget
            {...this.props}
            headerParams={widgetHeaderParams}
            params={widgetParams}
            component={TestPageCardView}
          />
          <p>&nbsp;</p>
          {this.renderButtonBar()}
          {this.renderUrlParamsTest()}
          {this.state.testModalDynamicActive && (
            <TestDynamicModal
              {...this.props}
              data={this.state.testModalData}
              dataProvider={testDataProvider}
              onHide={() => this.setState({ testModalDynamicActive: false, testModalData: null })}
            />
          )}
          {this.state.testModalRegularActive && (
            <TestModal
              {...this.props}
              data={this.state.testModalData}
              onHide={() => this.setState({ testModalRegularActive: false })}
              onSubmit={async () => {}}
            />
          )}
          <TestComponents />
        </div>
      </section>
    )
  }
}

export default createPageContainer()(TestPage)



// WEBPACK FOOTER //
// ../src/containers/TestPage/TestPage.js