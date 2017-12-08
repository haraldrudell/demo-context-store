import React from 'react'
import { createPageContainer, PageBreadCrumbs } from 'components'
import SetupAsCodePanel from './SetupAsCodePanel'
import css from './SetupAsCodePage.css'

class SetupAsCodePage extends React.Component {
  state = {}
  title = this.renderTitleBreadCrumbs()
  pageName = 'Configuration As Code'

  componentDidMount () {
    document.body.classList.add('full-width')
  }

  componentWillUnmount () {
    document.body.classList.remove('full-width')
  }

  renderTitleBreadCrumbs () {
    const bData = [
      {
        label: 'Setup',
        link: this.props.path.toSetup(this.props.urlParams)
      },
      { label: 'Configuration As Code' }
    ]
    return <PageBreadCrumbs data={bData} />
  }

  render () {
    return (
      <section className={'content ' + css.main}>
        <SetupAsCodePanel {...this.props} className={css.panel} />
      </section>
    )
  }
}

export default createPageContainer()(SetupAsCodePage)



// WEBPACK FOOTER //
// ../src/containers/SetupAsCode/SetupAsCodePage.js