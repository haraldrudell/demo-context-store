import React from 'react'
import ServiceSummaryCard from './ServiceSummaryCard'
import css from './ServiceSummaryCardList.css'

export default class ServiceSummaryCardList extends React.Component {
  render () {
    const services = this.props.params.data || []
    const params = this.props.params || []

    return (
      <div className={`${css.main}`}>
        {services.map((service, idx) =>
          <ServiceSummaryCard {...this.props} key={idx} service={service} params={params} />
        )}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServicesDashboardPage/ServiceSummaryCardList.js