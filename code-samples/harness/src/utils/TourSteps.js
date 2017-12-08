const TourSteps = {
  DASHBOARD: [
    {
      title: 'ADD AN APPLICATION',
      text: `<div><div>All Applications</div>
    All Applications screen enables you to create an Application or View the existing Applications.</div>`,
      selector: 'li.applicationsMenu a',
      position: 'right',
      type: 'hover'
    }
  ],
  APPLICATION: [
    {
      title: 'ADD AN APPLICATION',
      text: '<div><div>Add Application</div> Please click to add an application.</div>',
      selector: '.__addNew',
      position: 'bottom',
      type: 'hover'
    }
  ],
  ADD_APPLICATION: [
    {
      title: 'ADD AN APPLICATION',
      text: '<div><div>Name Application</div> Please enter details for the new application.</div>',
      selector: '.__applicationModal  button[type="submit"]',
      position: 'right',
      type: 'hover'
    }
  ],
  SETUP_SERVICE: [
    {
      title: 'SETUP SERVICE',
      text: '<div><div>Services</div> Please click to go to Service Screen to setup Service.</div>',
      selector: '.__setupServices a',
      position: 'bottom-left',
      type: 'hover'
    }
  ],
  SETUP_ENVIRONMENT: [
    {
      title: 'SETUP ENVIRONMENTS',
      text: '<div><div>Environments</div> Please click to go to Environments Screen to setup Environment.</div>',
      selector: '.__setupEnvironments a',
      position: 'bottom-left',
      type: 'hover'
    }
  ],
  SETUP_ARTIFACT_STREAM: [
    {
      title: 'SETUP ARTIFACT STREAM',
      text:
        '<div><div>Artifact Streams</div> Please click to go to Artifact Stream Screen to setup Artifact Stream.</div>',
      selector: '.__setupArtifactStream a',
      position: 'bottom',
      type: 'hover'
    }
  ],
  SETUP_ARTIFACT_SOURCE: [
    {
      title: 'Add Artifact Source',
      text: '<div>Please click here to add artifact source</div>',
      selector: '.__artifact-add-button',
      position: 'right',
      type: 'hover'
    }
  ],
  SETUP_COMMANDS: [
    {
      title: 'Review/Add Command',
      text:
        '<div><div>Please click on' +
        'one of the Commands to review orclick on "Add Command"' +
        'to add a new Command</div><a>I am done reviewing commands </a></div>',
      selector: '.__commandSection',
      position: 'top',
      type: 'hover'
    }
  ],
  SETUP_SERVICE_SPECIFICATION: [
    {
      title: 'Review Service Specification',
      text:
        '<div><div>Please click on link to review service specification</div>' +
        '<a>I am done reviewing specifications</a></div>',
      selector: '.__service-specifications',
      position: 'top',
      type: 'hover'
    }
  ],
  SERVICE: [
    {
      title: 'SETUP SERVICE',
      text: '<div><div>Add Service</div> Please click to add a Service.</div>',
      selector: '.__addService',
      position: 'right',
      type: 'hover'
    }
  ],
  ADD_SERVICE: [
    {
      title: 'SETUP SERVICE',
      text: '<div><div>Configure Service</div> Please add Service Details.</div>',
      selector: '.__serviceModal  button[type="submit"]',
      position: 'right',
      type: 'hover'
    }
  ],
  ENVIRONMENT: [
    {
      title: 'SETUP ENVIRONMENTS',
      text: '<div><div>Setup Environment</div> Please add or select an environment to add Hosts for Deployment.</div>',
      selector: '.wings-add-new',
      position: 'right',
      type: 'hover'
    }
  ],
  ENVIRONMENT_SELECT_HOST: [
    {
      title: 'SETUP ENVIRONMENTS',
      text: '<div><div>Setup Environment</div> Please click to add hosts.</div>',
      selector: '.__addHost',
      position: 'right',
      type: 'hover'
    }
  ],
  ENVIRONMENT_ADD_HOST: [
    {
      title: 'SETUP ENVIRONMENTS',
      text: '<div><div>Setup Environment</div> Please add Host Details.</div>',
      selector: '.__hostModal button[type="submit"]',
      position: 'right',
      type: 'hover'
    }
  ],
  ARTIFACT_STREAM: [
    {
      title: 'SETUP ARTIFACT STREAM',
      text: '<div><div>Artifact Streams</div> Please click to add an Artifact Stream.</div>',
      selector: '.wings-add-new',
      position: 'right',
      type: 'hover'
    }
  ]
}

export default TourSteps



// WEBPACK FOOTER //
// ../src/utils/TourSteps.js