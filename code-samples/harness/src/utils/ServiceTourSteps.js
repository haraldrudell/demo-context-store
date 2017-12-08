import React from 'react'
export default class ServiceTourSteps {
  static Stage = {
    step1: 1, // Add Application
    step2: 2, // Setup service
    step3: 3, // add artifact source
    nonDockerstep4: 3, // more artifact source for non docker
    dockerstep4: 3, // more artifact surce for docker
    nonDockerStep5: 4, // add/review commands
    dockerStep5: 4, // add/review specification
    dockerStep6: 5, // add configVar for docker
    nonDockerStep6: 5, // add configvar for nondocker
    nonDockerStep7: 6 // add configfiles for docker
  }

  static endTour
  static step1 (selector, text, position, renderEndTour) {
    const stepText = this.getStep1Content(text, renderEndTour)
    return this.getStep('Select Application', stepText, selector, position)
  }

  static step2 (selector, position, renderEndTour, setup = false) {
    const stepText = this.getStep2Content(renderEndTour, setup)
    return this.getStep('SETUP SERVICE', stepText, selector, position)
  }
  static step3 (selector) {
    const stepText = this.getStep3Content()
    const step = this.getStep('Add Artifact Source', stepText, selector, 'bottom')
    return step
  }
  static step4 (selector, onNextStepClick) {
    const stepText = this.getStep4Content(onNextStepClick)
    return this.getStep('Add Artifact Source', stepText, selector, 'bottom')
  }

  static step5ForDocker (selector, onNextStepClick) {
    const stepText = this.getStep5ContentForDocker(onNextStepClick)
    const title = 'Review Service Specification'
    return this.getStep(title, stepText, selector, 'top')
  }
  static step5ForNonDocker (selector, onNextStepClick) {
    const stepText = this.getStep5ContentForNonDocker(onNextStepClick)
    const title = 'Review/Add Command'
    return this.getStep(title, stepText, selector, 'top')
  }
  static step6 (selector, onNextStepClick) {
    const stepText = this.getStep6Content(onNextStepClick)
    return this.getStep('Add Configuration Variable', stepText, selector, 'top')
  }
  static step7 (selector, onNextStepClick) {
    const stepText = this.getStep7Content(onNextStepClick)
    return this.getStep('Add Configuration File', stepText, selector, 'left')
  }

  static getStep (title, stepText, selector, position, scroll = false) {
    return [
      {
        title: title,
        text: stepText,
        selector: selector,
        position: position,
        type: 'hover',
        disableOverlay: false
      }
    ]
  }

  static getStep1Content (text, renderEndTour) {
    return (
      <div className="service-step">
        <div>{text}</div>
        {renderEndTour()}
      </div>
    )
  }
  static getStep2Content (renderEndTour, setup) {
    if (setup) {
      return (
        <div className="service-step">
          <div>Services</div>Please click to go to Service Screen to setup Service.
          {renderEndTour()}
        </div>
      )
    } else {
      return (
        <div className="service-step">
          <div>Add Service</div>
          Please click to add a Service.
          {renderEndTour()}
        </div>
      )
    }
  }

  static getStep3Content () {
    return (
      <div className="service-step">
        <div>Please click here to add artifact source</div>
        {this.endTour()}
      </div>
    )
  }
  static getStep4Content (onNextStepClick) {
    return (
      <div className="service-step">
        <div>Artifact Source added.Please click on Add more Artifact Sources if you want to add more</div>
        <a onClick={onNextStepClick} className="tour-next-step">
          I am done with Artifact sources{' '}
        </a>
        {this.endTour()}
      </div>
    )
  }
  static getStep5ContentForNonDocker (onNextStepClick) {
    return (
      <div className="service-step">
        <div>Please click on one of the Commands to review or click on "Add Command" to add a new Command</div>
        <a onClick={onNextStepClick} className="tour-next-step">
          I am done reviewing commands{' '}
        </a>
        {this.endTour()}
      </div>
    )
  }
  static getStep5ContentForDocker (onNextStepClick) {
    return (
      <div className="service-step">
        <div>Please click on link to review service specification</div>
        <a onClick={onNextStepClick} className="tour-next-step">
          I am done reviewing specifications
        </a>
        {this.endTour()}
      </div>
    )
  }
  static getStep6Content (onNextStepClick) {
    return (
      <div className="service-step">
        <div>
          {' '}
          Define a Configuration Variable. Configuration Variables are used to parameterize the Command or Deployment
          Workflow. At runtime its also exposed as environment variables.{' '}
        </div>
        <a onClick={onNextStepClick} className="tour-next-step">
          {' '}
          Done with Configuration Variables
        </a>

        {this.endTour()}
      </div>
    )
  }

  static getStep7Content (reset) {
    return (
      <div className="service-step">
        <div> Attach default configuration files</div>
        <a onClick={reset} className="tour-next-step">
          {' '}
          Done with Configuration Files
        </a>
        {this.endTour()}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/utils/ServiceTourSteps.js