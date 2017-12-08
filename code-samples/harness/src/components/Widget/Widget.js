import React from 'react'
import css from './Widget.css'
import WidgetHeader2 from '../../components/WidgetHeader2/WidgetHeader2'

const defaultNoData = (
  <ui-card>
    <main className="no-data-box">
      <span>No data available.</span>
    </main>
  </ui-card>
)

class WidgetContent extends React.Component {
  render () {
    let view
    let Comp = {}
    let params = {}

    // for temporary backwards compatibility
    if (this.props.component) {
      Comp = this.props.component
      params = this.props.params
    } else {
      // for temporary backwards compatibility
      if (this.props.views) {
        view = this.props.views[0]
        params = this.props.views[0].params
      } else {
        view = this.props.view
        params = this.props.view.params
      }
      Comp = view.component
    }

    if (this.props.isPageInitialized === true && params.data && params.data.length === 0) {
      if (params.hasOwnProperty('noDataMessage')) {
        return params.noDataMessage
      } else {
        return defaultNoData
      }
    }

    return <Comp {...this.props} params={params} />
  }
}

export default class Widget extends React.Component {
  constructor () {
    super()
    this.state = { currentView: 0 }
  }

  render () {
    let headerClass = ''
    let hideHeader
    let headerComponent

    if (this.props.headerParams) {
      headerClass = this.props.headerParams.headerClass
      hideHeader = this.props.headerParams.hideHeader
      headerComponent = this.props.headerParams.headerComponent
    }

    return (
      <section className={css.main}>
        {/* Header */}
        {/* Do not insert anything if hideHeader is true */}
        {/* If header is not hidden, use default header if none is provided  */}

        {!hideHeader &&
          <div className={headerClass}>
            {headerComponent
              ? <this.props.headerParams.headerComponent />
              : <WidgetHeader2 headerParams={this.props.headerParams} />}
          </div>}

        {/* Body */}
        <WidgetContent {...this.props} view={this.props.view} views={this.props.views} />
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/Widget/Widget.js