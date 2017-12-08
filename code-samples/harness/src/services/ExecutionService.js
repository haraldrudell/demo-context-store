// @ts-check
import xhr from 'xhr-async'
import Logger from '../utils/Logger'
import { ExecutionType, InterruptedType, NonEndedExecutionStatus, EndedExecutionStatus } from '../utils/Constants'
import { errorMessageFromResponse } from './ServicesUtils'

import dataService from '../apis/dataService'
import * as Service from './Service'

export const endpoints = Service.endpointPaths({
  editNotes: ({ execId }) => `executions/${execId}/notes`
})

/**
 * Test if an execution has ended.
 * @param {string} status - Execution status.
 * @returns {boolean} - True if the execution has ended.
 */
export function isExecutionEnded (status) {
  return EndedExecutionStatus.indexOf(status) !== -1
}

/**
 * Test if an execution is still on-going (not yet ended).
 * @param {string} status - Execution status.
 * @returns {boolean} - True if the execution has not yet ended.
 */
export function isExecutionOnGoing (status) {
  return NonEndedExecutionStatus.indexOf(status) !== -1
}

/**
 * Send an interrupt execution request.
 *
 * @param {Object} execInfo - Execution info.
 * @param {string} execInfo.accountId - Account id.
 * @param {string} execInfo.appId - Application id.
 * @param {string} execInfo.execUUID - Execution uuid.
 * @returns {Promise<{ status, error }>} - Promise of { status, error }.
 */
async function interruptExecution ({ accountId, appId, execUUID, interruptType }) {
  const url = `/executions/${execUUID}?accountId=${accountId}&appId=${appId}`
  const { status, error, response } = await xhr.put(url, { data: { executionInterruptType: interruptType } })
  return { status, error: errorMessageFromResponse(error, response) }
}

/**
 * Abort an on-going execution.
 *
 * @param {Object} execInfo - Execution info.
 * @param {string} execInfo.accountId - Account id.
 * @param {string} execInfo.appId - Application id.
 * @param {string} execInfo.execUUID - Execution uuid.
 * @returns {Promise<{ status, error }>} - Promise of { status, error }.
 */
export async function abort ({ accountId, appId, execUUID }) {
  return interruptExecution({ accountId, appId, execUUID, interruptType: InterruptedType.ABORT_ALL })
}

/**
 * Rollback an on-going execution
 * @param {Object} execInfo - Execution info.
 * @param {string} execInfo.accountId - Account id.
 * @param {string} execInfo.appId - Application id.
 * @param {string} execInfo.execUUID - Execution uuid.
 * @returns {Promise<{ status, error }>} - Promise of { status, error }.
 */

export async function rollback ({ accountId, appId, execUUID }) {
  return interruptExecution({ accountId, appId, execUUID, interruptType: InterruptedType.ROLLBACK })
}

/**
 * Pause an on-going execution.
 *
 * @param {Object} execInfo - Execution info.
 * @param {string} execInfo.accountId - Account id.
 * @param {string} execInfo.appId - Application id.
 * @param {string} execInfo.execUUID - Execution uuid.
 * @returns {Promise<{ status, error }>} - Promise of { status, error }.
 */
export async function pause ({ accountId, appId, execUUID }) {
  return interruptExecution({ accountId, appId, execUUID, interruptType: InterruptedType.PAUSE_ALL })
}

/**
 * Resume a paused execution.
 *
 * @param {Object} execInfo - Execution info.
 * @param {string} execInfo.accountId - Account id.
 * @param {string} execInfo.appId - Application id.
 * @param {string} execInfo.execUUID - Execution uuid.
 * @returns {Promise<{ status, error }>} - Promise of { status, error }.
 */
export async function resume ({ accountId, appId, execUUID }) {
  return interruptExecution({ accountId, appId, execUUID, interruptType: InterruptedType.RESUME_ALL })
}

/**
 * Fetch executions (pipeline + workflow). When appId and execId are passed,
 * fetch returns array with a single execution.
 *
 * @param {Object} options - Options.
 * @param {string} options.accountId - Account id.
 * @param {string} options.appId - App id.
 * @param {string} options.execId - Execution id.
 * @param {string} options.filter - Filter string.
 * @param {Function} [options.ref] - Xhr reference (optional).
 * @param {string} [options.group] - Xhr group (optional).
 * @param {boolean} [options.includePipeline] - Set to true to include only pipeline executions.
 * @param {boolean} [options.includeWorkflow] - Set to true to include only workflow executions.
 * @returns {Promise<{ status?, error?, executions?, response? }>} - Promise of response and executions.
 */
export async function fetchExecutions ({
  accountId,
  appId,
  execId,
  filter,
  ref = _ => null,
  group,
  includePipeline = true,
  includeWorkflow = true
}) {
  let url = `/executions${execId ? '/' + execId : ''}?accountId=${accountId}${includePipeline
    ? `&workflowType=${ExecutionType.PIPELINE}`
    : ''}${includeWorkflow ? `&workflowType=${ExecutionType.WORKFLOW}` : ''}${filter ? '&' + filter : ''}`
  url += `${appId ? '&appId=' + appId : ''}`
  const { response, error, status } = await xhr.get(url, { ref, group })

  if (!error) {
    const { resource } = response
    return { executions: appId && execId ? [resource] : resource.response, response: response.resource }
  }

  return { error, status }
}

/**
 * Fetch all non-end state execution ids (UUIDs) of an account. The response of this API call
 * is usually used to determine polling for non-end state execution details.
 *
 * @param {Object} options - Options.
 * @param {string} options.accountId - Account id.
 * @param {Function} [options.ref] - Xhr reference (optional).
 * @param {string} [options.group] - Xhr group (optional).
 * @returns {Promise<Array>} - Promise of response and executions.
 */
export async function fetchNonEndStateExecutionIds ({ accountId, ref = _ => null, group }) {
  // Ideally, back-end should have a Redis instance to sync non-end state execution uuids
  // Currently, we fetch directly through MongoDB, which is not very fast!
  const searchValues = NonEndedExecutionStatus.map(status => `search[0][value]=${status}`).join('&')
  // eslint-disable-next-line
  const url = `/executions?accountId=${accountId}&workflowType=${ExecutionType.PIPELINE}&workflowType=${ExecutionType.WORKFLOW}&limit=1000&fieldsIncluded=uuid&search[0][field]=status&search[0][op]=IN&${searchValues}`
  const { response, error, status } = await xhr.get(url, { ref, group })

  if (!error && status === 200) {
    const { resource: { response: execs } } = response

    if (execs && execs.length) {
      return execs.map(exec => exec.uuid)
    }
  } else {
    Logger.error('Failed to execute fetchNonEndStateExecutionIds', { error, status, url })
  }

  return []
}

export async function fetchWorkflowExecutionDetails ({ execUUID, appId, envId, group, ref }) {
  const url = `/executions/${execUUID}?appId=${appId}&envId=${envId}`
  const { status, error, response } = await xhr.get(url, { group, ref })

  if (status === 200) {
    return { execution: response.resource }
  } else {
    return { status, error }
  }
}

/**
 * Approve a pipeline approval stage.
 *
 * @param {Object} options - Options.
 * @param {string} options.appId - Account id.
 * @param {string} options.workflowExecId - Workflow execution uuid.
 * @param {string} options.approvalId - Approval id.
 * @param {string} options.comments - Comments.
 * @param {string} [options.action] - Action (default to 'APPROVE').
 * @param {Function} [options.ref] - Xhr reference (optional).
 * @returns {Promise<{ status, error }>} - Promise of response and executions.
 */
export async function approve ({ appId, workflowExecId, approvalId, comments, action, ref = _ => null }) {
  const url = `/executions/${workflowExecId}/approval?appId=${appId}`
  const { status, error, response } = await xhr.put(url, { data: { approvalId, comments, action }, ref })

  return { status, error: errorMessageFromResponse(error, response) }
}

/**
 * Reject a pipeline approval stage.
 *
 * @param {Object} options - Options.
 * @param {string} options.appId - Account id.
 * @param {string} options.workflowExecId - Workflow execution uuid.
 * @param {string} options.approvalId - Approval id.
 * @param {string} options.comments - Comments.
 * @param {Function} [options.ref] - Xhr reference (optional).
 * @returns {Promise<{ status, error }>} - Promise of response and executions.
 */
export async function reject ({ appId, workflowExecId, approvalId, comments, ref = _ => null }) {
  return approve({ appId, workflowExecId, approvalId, comments, action: 'REJECT', ref })
}

/**
 * Deploy a workflow.
 *
 * @param {Object} options - Deployment options.
 * @param {string} options.appId - Account id.
 * @param {string} [options.envId] - Environment id (optional).
 * @param {string} options.workflowId - Workflow id.
 * @param {string} options.artifacts - Artifacts object.
 * @param {string} [options.workflowType] - Workflow type (default to 'ORCHESTRATION').
 * @param {string} [options.executionCredential] - Credential (optional).
 * @param {string} [options.workflowVariables] - Workflow variables (optional).
 * @param {Function} [options.ref] - Xhr reference (optional).
 * @param {string} [options.group] - Xhr group (optional).
 * @returns {Promise<{ status, error, response }>} - Promise of response and executions.
 */
export async function deployWorkflow ({
  appId,
  envId = null,
  workflowId,
  artifacts,
  workflowType = ExecutionType.WORKFLOW,
  executionCredential = null,
  workflowVariables = null,
  notes = null,
  ref = _ => null,
  group
}) {
  const url = `/executions?appId=${appId}${envId ? '&envId=' + envId : ''}`
  const data = { workflowType, artifacts, executionCredential, workflowVariables, notes }

  if (workflowType === ExecutionType.WORKFLOW) {
    data.orchestrationId = workflowId
  } else {
    data.pipelineId = workflowId
  }

  const { status, error, response } = await xhr.post(url, { data, ref, group })
  return { status, error: errorMessageFromResponse(error, response), response }
}

/**
 * Deploy a pipeline.
 *
 * @param {Object} options - Deployment options.
 * @param {string} options.appId - Account id.
 * @param {string} options.workflowId - Workflow id.
 * @param {string} options.artifacts - Artifacts object.
 * @param {Function} [options.ref] - Xhr reference (optional).
 * @param {string} [options.group] - Xhr group (optional).
 * @returns {Promise<{ status, error, response }>} - Promise of response and executions.
 */
export async function deployPipeline ({ appId, workflowId, artifacts, notes, ref = _ => null, group }) {
  return deployWorkflow({ appId, workflowId, artifacts, notes, workflowType: ExecutionType.PIPELINE, ref, group })
}

export async function editNotes ({ execId, appId, body }) {
  const endpoint = endpoints.editNotes({ execId }, { appId })
  const { error, resource } = await dataService.makeRequest(endpoint, { method: 'PUT', body })
  return { resource, error }
}



// WEBPACK FOOTER //
// ../src/services/ExecutionService.js