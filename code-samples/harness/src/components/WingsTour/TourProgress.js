import React, { PropTypes } from 'react'
import Utils from '../Utils/Utils'
import css from './TourProgress.css'

const modalSteps = {
  1: 'ADD AN APPLICATION',
  2: 'SETUP SERVICE',
  3: 'SETUP ENVIRONMENT',
  4: 'SETUP ARTIFACT STREAM'
}
const serviceNonDockerSteps = {
  1: 'SELECT APPLICATION',
  2: 'ADD SERVICE',
  3: 'ADD ARTIFACT SOURCE',
  4: 'REVIEW/ADD COMMAND',
  5: 'ADD CONFIGURATION VARIABLES',
  6: 'ADD CONFIGURATION FILES'
}
// const pipelineSteps = {
//   1: 'SELECT APPLICATION',
//   2: 'ADD PIPELINE'
// }
const serviceDockerSteps = {
  1: 'SELECT APPLICATION',
  2: 'ADD SERVICE',
  3: 'ADD ARTIFACT SOURCE',
  4: 'REVIEW/ADD SERVICE SPECIFICATION',
  5: 'ADD  CONFIGURATION VARIABLES'
}
export default class TourProgress extends React.Component {
  state = {
    tourProgressSteps: {},
    resumeClass: 'hide'
  }
  componentWillReceiveProps (newProps) {

    let steps = []
    if (newProps.showServiceDialog) {
      steps = this.setStepsOnServiceTour()
    } else {
      steps = modalSteps
    }
    this.setState({ tourProgressSteps: steps })
  }
  setStepsOnServiceTour = () => {
    let steps = []
    if ( this.isDockerOnSession() ) {
      const isDocker = this.converToBoolean(sessionStorage.getItem('isDocker'))
      steps = (isDocker) ? serviceDockerSteps : serviceNonDockerSteps
    } else {
      steps = serviceDockerSteps
    }
    return steps
  }
  isDockerOnSession = () => {
    return sessionStorage.getItem('isDocker')
  }
  converToBoolean = (isDocker) => {
    return JSON.parse(isDocker)
  }
  static propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    onSubmit: PropTypes.func
  }

  onCancel = (e) => {
    e.preventDefault()
    this.props.onTourStop()
    Utils.showBugMuncher()
    this.props.endServiceTour()
  }

  setResumeClass = ( step, stage) => {

    if (this.props.showServiceDialog && this.props.isTourOn &&
      this.props.currentStepStatus === 'paused' && step === stage) {
      return 'resume'
    } else {
      return 'hide'
    }
  }

  renderSteps () {
    const stage = (this.props.showServiceDialog) ? this.props.serviceTourStageNum : this.props.tourStage
    const className = (varStep) => {
      const step = parseInt(varStep)
      return step === stage ? 'inprogress' : step < stage ? 'done' : ''
    }
    const resumeClass = (varStep) => {
      const step = parseInt(varStep)
      return this.setResumeClass(step, stage)
    }
    return (
      <div className="__steps">
        {Object.keys(this.state.tourProgressSteps).map(step =>
          <div key={step} className={`__step ${className(step)}`}>
            <span className="badge">{step}</span>
            {this.state.tourProgressSteps[step]}
            <a className={`${resumeClass(step)}`}
              onClick={() => this.onResumeClick()}>
            Resume Tour
              <i className="icons8-forward resume-icon"></i>
            </a>


          </div>
        )}
      </div>
    )
  }

  onResumeClick = () => {

    const serviceId = sessionStorage.getItem('tourServiceId')
    const appId = sessionStorage.getItem('tourAppId')
    const isServiceDetailPage = Utils.isServiceDetail()
    if (isServiceDetailPage) {
      Utils.redirect({ appId: appId, page: 'blank' })
      /* To have the previous step adding you need some timeout */
      this.setToRedirect(appId, serviceId)
    } else {
      this.setToRedirect(appId, serviceId)
    }
  }
  setToRedirect = (appId, serviceId) => {
    window.setTimeout( () => {
      this.redirectToServiceDetail(appId, serviceId)
    }, 200)
  }
  redirectToServiceDetail = (appId, serviceId) => {
    this.props.setCurrentStepStatus('inprogress')
    if (appId && serviceId) {

      Utils.redirect({ appId: appId, serviceId: serviceId, page: 'detail' })
    } else if (appId) {
      this.setToServicesPage(appId)
    } else {

      Utils.redirect({ page: 'dashboard' })
    }
  }

  setToServicesPage = (appId) => {
    Utils.redirect({ appId: appId, page: 'blank' })
    window.setTimeout( () => {
      Utils.redirect({ appId: appId, page: 'services' })
    }, 200)
  }
  render () {
    /*
      <div className="__endTour">
            <a href="javascript;" onClick={this.onCancel.bind(this)}>End tour</a>
          </div>
    */
    if (!this.props.show) {
      return null
    }

    return (
      <div className={css.main}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" aria-label="Close" onClick={this.onCancel.bind(this)}>
              <span aria-hidden="true">×</span>
            </button>
            <h4 className="modal-title">
              {this.props.showServiceDialog && 'SETUP SERVICE'}
              {!this.props.showServiceDialog && 'SETUP APPLICATION'}
            </h4>
          </div>
          <div className="modal-body">
            {this.renderSteps()}
          </div>
          <div className="modal-footer">
          </div>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/WingsTour/TourProgress.js