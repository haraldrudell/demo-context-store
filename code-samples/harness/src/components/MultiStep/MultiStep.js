import React from 'react'
import css from './MultiStep.css'

// source: https://github.com/srdjan/react-multistep/blob/master/src/multistep.js

export default class MultiStep extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showPreviousBtn: false,
      showNextBtn: true,
      compState: this.props.defaultStep || 0,
      navState: this.getNavStates(0, this.props.steps.length)
    }
    this.hidden = {
      display: 'none'
    }
    this.handleOnClick = this.handleOnClick.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)

    if (this.props.defaultStep) {
      this.setNavState(this.props.defaultStep)
    }
  }

  getNavStates (indx, length) {
    const styles = []
    for (let i = 0; i < length; i++) {
      if (i < indx) {
        styles.push('done')
      } else if (i === indx || i === this.props.defaultStep) {
        styles.push('doing')
      } else {
        styles.push('todo')
      }
    }
    return { current: indx, styles: styles }
  }

  checkNavState (currentStep) {
    if (currentStep > 0 && currentStep < this.props.steps.length - 1) {
      this.setState({
        showPreviousBtn: true,
        showNextBtn: true
      })
    } else if (currentStep === 0) {
      this.setState({
        showPreviousBtn: false,
        showNextBtn: true
      })
    } else {
      this.setState({
        showPreviousBtn: true,
        showNextBtn: false
      })
    }
  }

  setNavState (next) {
    this.setState({ navState: this.getNavStates(next, this.props.steps.length) })
    if (next < this.props.steps.length) {
      this.setState({ compState: next })
    }
    this.checkNavState(next)
  }

  handleKeyDown (evt) {
    if (evt.which === 13) {
      this.next()
    }
  }

  handleOnClick (evt) {
    if (
      evt.currentTarget.value === this.props.steps.length - 1 &&
      this.state.compState === this.props.steps.length - 1
    ) {
      this.setNavState(this.props.steps.length)
    } else {
      this.setNavState(evt.currentTarget.value)
    }
  }

  next () {
    this.setNavState(this.state.compState + 1)
  }

  previous () {
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1)
    }
  }

  getClassName (className, i) {
    return className + '-' + this.state.navState.styles[i]
  }

  renderSteps () {
    return this.props.steps.map((s, i) => (
      <li className={this.getClassName('progtrckr', i)} onClick={this.handleOnClick} key={i} value={i}>
        <em>{i + 1}</em>
        <span>{this.props.steps[i].name}</span>
      </li>
    ))
  }

  render () {
    return (
      <div className={css.main + ' ' + this.props.className} onKeyDown={this.handleKeyDown}>
        <ol className="progtrckr">{this.renderSteps()}</ol>

        {this.props.steps[this.state.compState].component}

        <footer style={this.props.showNavigation ? {} : this.hidden}>
          {/* style={this.state.showPreviousBtn ? {} : this.hidden} */}
          <button disabled={!this.state.showPreviousBtn} className="multistep__btn--prev" onClick={this.previous}>
            Previous
          </button>

          {/* style={this.state.showNextBtn ? {} : this.hidden} */}
          <button disabled={!this.state.showNextBtn} className="multistep__btn--next" onClick={this.next}>
            Next
          </button>
        </footer>
      </div>
    )
  }
}

MultiStep.defaultProps = {
  showNavigation: true
}



// WEBPACK FOOTER //
// ../src/components/MultiStep/MultiStep.js