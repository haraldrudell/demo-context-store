/*
 * Group stages by parallel status
 * @param {Array} stages pipeline setup stages
 * @param {Array} pipelineStageExecutions pipeline execution stages (optional, available only pipeline view dashboard)
 * @returns Stages that are grouped by parallel status
 */
export function parallelGrouping (stages, pipelineStageExecutions) {
  const len = stages.length
  let index = 0
  let group = 1
  const FAILED = 'FAILED'
  const RUNNING = 'RUNNING'

  while (index < len) {
    const stage = stages[index]

    if (pipelineStageExecutions && pipelineStageExecutions[index]) {
      stage.status = pipelineStageExecutions[index].status
    }

    stage.parallelAttrs = {}

    if (stage.parallel) {
      stage.group = group
      stage.parallelAttrs = { parallel: true }

      const prevStage = stages[index - 1]
      if (prevStage && !prevStage.parallel) {
        prevStage.parallelAttrs = { parallel: true, first: true }
      }

      const nextStage = stages[index + 1]
      if (!nextStage || !nextStage.parallel) {
        stage.parallelAttrs.last = true
        const parallelGroup = stages.filter(stage => stage.group === group)

        // Determine status for the whole parallel group when execution is passed
        if (parallelGroup.some(stage => stage.status === FAILED)) {
          parallelGroup.forEach(stage => stage.parallelAttrs['parallel-group-status'] = FAILED)
        } else if (parallelGroup.some(stage => stage.status === RUNNING)) {
          parallelGroup.forEach(stage => stage.parallelAttrs['parallel-group-status'] = RUNNING)
        }

        // If group has only one item, remove parallel state of that only item
        if (parallelGroup.length === 1) {
          delete parallelGroup[0].parallelAttrs
        }

        group++
      }
    } else {
      stage.group = group
      const nextStage = (index + 1 < stages.length) && stages[index + 1]

      if (!nextStage || !nextStage.parallel) {
        group++
      }
    }

    index++
  }

  return stages
}

export function getArtifactsFromExecution (execution) {
  const artifacts = {}
  const executions = execution.pipelineStageExecutions || execution.pipelineExecution.pipelineStageExecutions

  for (const stageExec of executions) {
    const workflowExecs = stageExec.workflowExecutions || []
    for (const wfExec of workflowExecs) {
      const wfArtifacts = wfExec.executionArgs.artifacts || []
      for (const artifact of wfArtifacts) {
        artifacts[artifact.uuid] = artifact
      }
    }
  }

  return Object.values(artifacts) // TODO: IE does not support Object.values
}


// WEBPACK FOOTER //
// ../src/pages/pipelines/PipelineUtils.js