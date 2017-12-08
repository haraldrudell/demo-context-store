import React from 'react'
import { Utils } from 'components'
import DeploymentCardViewCard from './DeploymentCardViewCard'
import Infinite from 'react-infinite'
import css from './DeploymentCardView.css'

export default class DeploymentCardView extends React.Component {
  state = { jsplumbLoaded: false }
  lastFetchOffset = -10

  componentWillReceiveProps (newProps) {
    if (newProps.params && newProps.params.jsplumbLoaded === true) {
      this.setState({ jsplumbLoaded: true })
    }
  }

  onInfiniteLoad = () => {
    if (Utils.checkMultiCalls('DeploymentCardView.onInfiniteLoad', 2000)) {
      return
    }
    this.lastFetchOffset += 10
    this.props.params.fetchData(null, this.lastFetchOffset)
  }

  render () {
    const execs = this.props.params.data || []

    for (const exec of execs) {
      exec.createdAtStr = new Date(exec.createdAt).toString()
    }

    return (
      <div className={`${css.main}`}>
        {this.props.params.enableInifiteScrolling !== false &&
          <Infinite
            enabled={this.props.enableInifiteScrolling !== false}
            elementHeight={253}
            infiniteLoadBeginEdgeOffset={60}
            onInfiniteLoad={this.onInfiniteLoad}
            loadingSpinnerDelegate={<div>Loading...</div>}
            useWindowAsScrollContainer={true}
          >
            {execs.map(item =>
              <DeploymentCardViewCard {...this.props}
                key={item.uuid}
                params={this.props.params}
                execution={item}
                path={this.props.path}
                urlParams={this.props.urlParams}
              />
            )}
          </Infinite>}
        {this.props.params.enableInifiteScrolling === false &&
          execs.map(item =>
            <DeploymentCardViewCard {...this.props}
              key={item.uuid}
              params={this.props.params}
              execution={item}
              path={this.props.path}
              urlParams={this.props.urlParams}
              router={this.props.router}
            />
          )}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/DeploymentPage/views/DeploymentCardView.js