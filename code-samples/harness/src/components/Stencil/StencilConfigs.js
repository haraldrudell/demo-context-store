import React from 'react'

const DEFAULT_VERIFICATION_ICON = 'icons8-fine-print'
const DEFAULT_COMMAND_ICON = 'icons8-source-code-filled'

const icons = {
  ELEMENT: 'icons8-circle-thin',
  ORIGIN: 'icons8-circle-thin',
  COMMAND: 'icons8-stop',
  EXEC: 'icons8-stop',
  REPEAT: 'icons8-repeat-2',
  FORK: 'icons8-split-filled',
  PHASE: 'icons8-bring-forward-filled',
  PHASE_STEP: 'icons8-bring-forward-filled',
  SUB_WORKFLOW: 'icons8-bring-forward-filled',
  BUILD: 'icons8-hammer',
  EMAIL: 'icons8-message-2',
  STATE_MACHINE: 'icons8-circle-thin',
  WAIT: 'icons8-timer-2',
  PAUSE: 'icons8-pause-filled',
  DEPLOY: 'icons8-circle-thin',
  HTTP: 'fa fa-file-code-o',
  SPLUNK: DEFAULT_VERIFICATION_ICON,
  SPLUNKV2: DEFAULT_VERIFICATION_ICON,
  ELK: DEFAULT_VERIFICATION_ICON,
  LOGZ: DEFAULT_VERIFICATION_ICON,
  SUMO: DEFAULT_VERIFICATION_ICON,
  APP_DYNAMICS: DEFAULT_VERIFICATION_ICON,
  NEW_RELIC: DEFAULT_VERIFICATION_ICON,
  CLOUD_WATCH: DEFAULT_VERIFICATION_ICON,
  AWS_LAMBDA_VERIFICATION: DEFAULT_VERIFICATION_ICON,
  ENV_STATE: 'icons8-module',
  APPROVAL: 'icons8-approve',
  ARTIFACT: 'icons8-approval',
  DC_NODE_SELECT: 'icons8-activity-grid-2',
  AWS_NODE_SELECT: 'icons8-activity-grid-2',
  PROVISION_NODE: 'icons8-activity-grid-2',
  CONTAINER_SETUP: DEFAULT_COMMAND_ICON,
  CONTAINER_DEPLOY: DEFAULT_COMMAND_ICON,
  AWS_AUTOSCALE_PROVISION: DEFAULT_COMMAND_ICON,
  AWS_CLUSTER_SETUP: DEFAULT_COMMAND_ICON,
  DOCKER_START: DEFAULT_COMMAND_ICON,
  DOCKER_STOP: DEFAULT_COMMAND_ICON,
  RESIZE: DEFAULT_COMMAND_ICON,
  RESIZE_KUBERNETES: DEFAULT_COMMAND_ICON,
  ECS_SERVICE_SETUP: DEFAULT_COMMAND_ICON,
  ECS_SERVICE_DEPLOY: DEFAULT_COMMAND_ICON,
  GCP_NODE_SELECT: DEFAULT_COMMAND_ICON,
  GKE_AUTOSCALE_PROVISION: DEFAULT_COMMAND_ICON,
  KUBERNETES_REPLICATION_CONTROLLER_SETUP: DEFAULT_COMMAND_ICON,
  KUBERNETES_REPLICATION_CONTROLLER_DEPLOY: DEFAULT_COMMAND_ICON,
  KUBERNETES_REPLICATION_CONTROLLER_ROLLBACK: 'icons8-restart',
  ECS_SERVICE_ROLLBACK: 'icons8-restart',
  ELASTIC_LOAD_BALANCER: DEFAULT_COMMAND_ICON,
  CODE_DEPLOY: 'icons8-orthogonal-view',
  AWS_CODEDEPLOY_STATE: 'icons8-orthogonal-view',
  AWS_LAMBDA_STATE: 'icons8-orthogonal-view',
  AWS_CODEDEPLOY_ROLLBACK: 'icons8-orthogonal-view',
  AWS_LAMBDA_ROLLBACK: 'icons8-orthogonal-view',
  ARTIFACT_COLLECTION: DEFAULT_COMMAND_ICON,

  // --- COMMANDS --- //
  COMMAND: DEFAULT_COMMAND_ICON,
  'COMMAND-START': 'icons8-start-2',
  'COMMAND-STOP': 'icons8-stop-2',
  'COMMAND-RESTART': 'icons8-restart',
  'COMMAND-INSTALL': 'icons8-installing-updates-2',
  SCP: 'icons8-send-file-2',
  COPY_CONFIGS: 'icons8-send-file-2',
  EXEC: 'icons8-console',
  PROCESS_CHECK_RUNNING: 'icons8-password-check',
  PROCESS_CHECK_STOPPED: 'icons8-stop-property',
  PORT_CHECK_LISTENING: 'icons8-hearing-filled',
  PORT_CHECK_CLEARED: 'icons8-not-hearing-filled',

  COMMAND: DEFAULT_COMMAND_ICON,
  SETUP_ENV: DEFAULT_COMMAND_ICON,
  TAIL_LOG: DEFAULT_COMMAND_ICON,
  PROCESS_CHECK: DEFAULT_COMMAND_ICON,
  COPY_ARTIFACT: DEFAULT_COMMAND_ICON,
  COPY_APP_CONTAINER: DEFAULT_COMMAND_ICON,
  LOAD_BALANCER: DEFAULT_COMMAND_ICON,
  JENKINS: DEFAULT_VERIFICATION_ICON,
  BAMBOO: DEFAULT_VERIFICATION_ICON
}

// example: StencilConfigs.getCategoryByNodeType('CLOUD_WATCH') => 'VERIFICATION'
const getCategoryByNodeType = nodeType => {
  const commandTypes = ['LOAD_BALANCER']
  const controlTypes = ['REPEAT', 'FORK', 'WAIT']
  const verificationTypes = ['HTTP', 'APP_DYNAMICS', 'JENKINS', 'BAMBOO', 'SPLUNK', 'CLOUD_WATCH']
  const otherTypes = ['EMAIL', 'APPROVAL']

  if (commandTypes.indexOf(nodeType) >= 0) {
    return 'COMMAND'
  } else if (controlTypes.indexOf(nodeType) >= 0) {
    return 'CONTROL'
  } else if (verificationTypes.indexOf(nodeType) >= 0) {
    return 'VERIFICATION'
  } else if (otherTypes.indexOf(nodeType) >= 0) {
    return 'OTHERS'
  }
  return nodeType
}

const getNodeIconClass = (type, name) => {
  const typeStr = type ? type.toUpperCase() : ''
  const nameStr = name ? name.toUpperCase() : ''
  const mapName = typeStr.toUpperCase() + '-' + nameStr.toUpperCase()
  let iconClass = icons[mapName]
  if (!iconClass) {
    iconClass = icons[typeStr.toUpperCase()]
  }
  return iconClass
}

const renderSelectLabel = stencil => {
  return (
    <span>
      <span className="badge wings-stencil-select2-icon">
        <i className={getNodeIconClass(stencil.type, stencil.name)} />
      </span>
      <span> {stencil.name} </span>
    </span>
  )
}

const StencilConfigs = {
  icons,
  getCategoryByNodeType,
  /* mapping TYPE-NAME to icon class names */
  getNodeIconClass,
  renderSelectLabel
}

export default StencilConfigs



// WEBPACK FOOTER //
// ../src/components/Stencil/StencilConfigs.js