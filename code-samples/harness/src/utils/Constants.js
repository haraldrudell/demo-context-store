/* This file contains common/shared application constants */

/** All execution statuses */
export const ExecutionStatus = {
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
  ABORTED: 'ABORTED',
  ERROR: 'ERROR',
  PAUSED: 'PAUSED',
  PAUSING: 'PAUSING',
  WAITING: 'WAITING',
  ABORTING: 'ABORTING',
  RUNNING: 'RUNNING',
  QUEUED: 'QUEUED'
}

/** Ended execution statuses */
export const EndedExecutionStatus = [
  ExecutionStatus.FAILED,
  ExecutionStatus.SUCCESS,
  ExecutionStatus.ABORTED,
  ExecutionStatus.ERROR
]

/** Non-ended execution statuses */
export const NonEndedExecutionStatus = [
  ExecutionStatus.PAUSED,
  ExecutionStatus.PAUSING,
  ExecutionStatus.WAITING,
  ExecutionStatus.ABORTING,
  ExecutionStatus.RUNNING,
  ExecutionStatus.QUEUED
]

/** Execution types */
export const ExecutionType = {
  PIPELINE: 'PIPELINE',
  WORKFLOW: 'ORCHESTRATION'
}

/** Interrupted types. */
export const InterruptedType = {
  ABORT_ALL: 'ABORT_ALL',
  PAUSE_ALL: 'PAUSE_ALL',
  RESUME_ALL: 'RESUME_ALL',
  ROLLBACK: 'ROLLBACK'
}

/** Pipeline stage type */
export const PipelineStageType = {
  APPROVAL: 'APPROVAL',
  WORKFLOW: 'ENV_STATE'
}

/** Mention Types */
export const MentionsType = {
  SERVICES: 'services',
  COMMANDS: 'commands',
  WORKFLOW_VARIABLES: 'workflow-variables',
  ENVIRONMENT_OVERRIDES: 'environment-overrides'
}


// WEBPACK FOOTER //
// ../src/utils/Constants.js