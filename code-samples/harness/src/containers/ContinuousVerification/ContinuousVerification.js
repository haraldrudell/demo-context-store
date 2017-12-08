import React from 'react'
import { observer } from 'mobx-react'
import { PageBreadCrumbs, createPageContainer } from 'components'
import css from './ContinuousVerification.css'

@observer
class ContinuousVerification extends React.Component {
  title = <PageBreadCrumbs data={[{ label: 'Continuous Verification' }]} />
  pageName = 'Continuous Verification'

  render () {
    return (
      <section className={css.main}>
        <h4>(Coming soon)</h4>
      </section>
    )
  }
}

export default createPageContainer()(ContinuousVerification)



// WEBPACK FOOTER //
// ../src/containers/ContinuousVerification/ContinuousVerification.js