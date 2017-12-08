import React from 'react'
export default class ConfigSteps {
  static moreConfigVariables (selector, nextStep, renderEndTour) {
    const stepText = ConfigSteps.moreConfigVarContent( nextStep, renderEndTour)
    return [{
      title: 'Add Configuration Variable',
      text: stepText,
      selector: selector,
      position: 'top',
      type: 'hover'
    }]
  }
  static moreConfigVarContent ( nextStep, renderEndTour) {
    return (
      <div className="service-step">
        <div> Define a Configuration Variable. Configuration Variables are used to parameterize
           the Command or Deployment Workflow. At runtime
           its also exposed as environment variables. </div>

        <a onClick={nextStep} className="tour-next-step"> Done With Configuration Variables</a>
        {renderEndTour()}
      </div>

    )
  }

  static moreConfigFiles (selector, nextStep, renderEndTour) {
    const stepText = ConfigSteps.moreConfigFileContent( nextStep, renderEndTour)
    return [{
      title: 'Add Configuration File',
      text: stepText,
      selector: selector,
      position: 'top-left',
      type: 'hover'
    }]
  }
  static moreConfigFileContent ( nextStep, renderEndTour) {
    return (
      <div className="service-step">
        <div> Attach default configuration files</div>
        <a className="tour-next-step" onClick={nextStep}>
             I am done with Configuration Files
        </a>
        {renderEndTour()}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ConfigPage/ConfigTourSteps.js