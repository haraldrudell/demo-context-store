import React from 'react'
import { Button } from 'react-bootstrap'

export default class SplunkFilters extends React.Component {

  state = {
    hidden: false
  }

  render () {
    const hiddenClass = this.state.hidden ? 'hidden' : ''
    const changeFilter = this.onClickFilterHandlerGenerator
    const fdClass = 'filter-deselected'
    const f = this.props.filters
    return (
      <div className={`event-filter-container ${hiddenClass}`}>
        { /* <h6>Filter</h6>*/ }
        { this.props.queries.length > 1 && (<div className="filter-area">
          <span>Query:</span>
          <div className="event-query-filters">
            <Button bsSize="xsmall" bsStyle="default">{'' + this.props.queries[0]}</Button>
          </div>
        </div> )
        }

        <div className="filter-area">
          <span>Event type:</span>
          <div className="event-type-filters">
            <Button bsSize="xsmall" bsStyle={(this.props.suspicious) ? 'warning' : 'danger'}
              className={!f.unknown && fdClass} onClick={changeFilter('unknown')}>

              Unknown Event
            </Button>
            <Button bsSize="xsmall" bsStyle={(this.props.suspicious) ? 'warning' : 'danger'}
              className={!f.unexpected && fdClass} onClick={changeFilter('unexpected')}>

              Unexpected Frequency
            </Button>
            <Button bsSize="xsmall" bsStyle="info"
              className={!f.anticipated && fdClass} onClick={changeFilter('anticipated')}>

              Anticipated Event
            </Button>
            <Button bsSize="xsmall" bsStyle="default"
              className={!f.baseline && fdClass} onClick={changeFilter('baseline')}>

              Baseline Event
            </Button>
          </div>
        </div>
      </div>
    )
  }

  onClickFilterHandlerGenerator = (filter) => {
    const filters = {}
    filters[filter] = true

    return (e) => {
      this.props.setFilters(filters)
    }
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/custom/SplunkFilters.js