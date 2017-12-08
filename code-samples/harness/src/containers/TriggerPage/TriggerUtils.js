import React from 'react'
import { NameValueList } from 'components'
import { Utils } from 'components'

export default class TriggerUtils {
  static getTypeText (trigger) {
    const cond = Utils.getJsonValue(trigger, 'condition.conditionType') || ''
    let typeText = cond
    if (cond === 'NEW_ARTIFACT') {
      typeText = 'On New Artifact'
    } else if (cond === 'PIPELINE_COMPLETION') {
      typeText = 'On Pipeline Completion'
    } else if (cond === 'WEBHOOK') {
      typeText = 'On Webhook Push Event'
    } else if (cond === 'SCHEDULED') {
      typeText = 'On Time Schedule'
    }
    return typeText
  }

  static getConditionText (trigger, pipelines = [], artifactSources = []) {
    const cond = Utils.getJsonValue(trigger, 'condition.conditionType') || ''

    let pipelineName = Utils.getJsonValue(trigger, 'condition.pipelineName')
    if (!pipelineName) {
      const found = pipelines.find(p => p.uuid === trigger.condition.pipelineId)
      pipelineName = found ? found.name : ''
    }
    let artifactSourceName = Utils.getJsonValue(trigger, 'condition.artifactSourceName')
    if (!artifactSourceName) {
      const found = artifactSources.find(a => a.uuid === trigger.condition.artifactStreamId)
      artifactSourceName = found ? found.sourceName : ''
    }

    let condText = cond
    if (cond === 'NEW_ARTIFACT') {
      condText = `Artifact Source: ${artifactSourceName}`
    } else if (cond === 'PIPELINE_COMPLETION') {
      condText = `Pipeline: ${pipelineName}`
    }
    return condText
  }

  static getActionText (selection, pipelines = [], artifactSources = []) {
    let pipelineName = Utils.getJsonValue(selection, 'pipelineName') || ''
    if (!pipelineName) {
      const found = pipelines.find(p => p.uuid === selection.pipelineId)
      pipelineName = found ? found.name : ''
    }
    let artifactSourceName = Utils.getJsonValue(selection, 'artifactSourceName') || ''
    if (!artifactSourceName) {
      const found = artifactSources.find(a => a.uuid === selection.artifactStreamId)
      artifactSourceName = found ? found.sourceName : ''
    }

    let actionText = selection.type
    if (selection.type === 'ARTIFACT_SOURCE') {
      actionText = 'Build/Version From Triggering Artifact Source'
    } else if (selection.type === 'PIPELINE_SOURCE') {
      actionText = 'Build/Version From Triggering Pipeline'
    } else if (selection.type === 'LAST_DEPLOYED') {
      actionText = `Build/Version From Last Deployed of "${pipelineName}"`
    } else if (selection.type === 'LAST_COLLECTED') {
      actionText = `Build/Version From Artifact Source of "${artifactSourceName}"`
    } else if (selection.type === 'WEBHOOK_VARIABLE') {
      actionText = `Webhook Variable - Artifact Source: "${artifactSourceName}"`
    }
    return actionText
  }

  static renderCondition (trigger, pipelines = [], artifactSources = []) {
    const arr = []
    const cond = Utils.getJsonValue(trigger, 'condition.conditionType') || ''
    if (cond === 'NEW_ARTIFACT') {
      arr.push({ name: 'Type', value: 'On New Artifact' })
      let sourceName = Utils.getJsonValue(trigger, 'condition.artifactSourceName') || ''
      const source = artifactSources.find(p => p.uuid === trigger.condition.artifactStreamId)
      sourceName = source ? source.sourceName : sourceName
      arr.push({ name: 'Artifact Source', value: sourceName })
    } else if (cond === 'PIPELINE_COMPLETION') {
      arr.push({ name: 'Type', value: 'On Pipeline Completion' })
      let pipelineName = Utils.getJsonValue(trigger, 'condition.pipelineName') || ''
      const pipeline = pipelines.find(p => p.uuid === trigger.condition.pipelineId)
      pipelineName = pipeline ? pipeline.name : pipelineName
      arr.push({ name: 'Pipeline', value: pipelineName })
    } else if (cond === 'WEBHOOK') {
      arr.push({ name: 'Type', value: 'On Webhook Push Event' })
    } else if (cond === 'SCHEDULED') {
      arr.push({ name: 'Type', value: 'On Time Schedule' })
      arr.push({ name: 'Schedule', value: trigger.condition.cronDescription })
    }
    return <NameValueList customWidths={['18%', '82%']} data={arr} />
  }

  static renderActions (trigger, pipelines = [], artifactSources = [], services = []) {
    const arr = []
    const pipeline = pipelines.find(p => p.uuid === trigger.pipelineId)
    const pipelineName = trigger.pipelineName ? trigger.pipelineName : pipeline ? pipeline.name : ''
    if (pipelineName) {
      arr.push({ name: 'Execute Pipeline', value: pipelineName })
    }
    const selections = Utils.getJsonValue(trigger, 'artifactSelections') || []
    for (const selection of selections) {
      let serviceName = Utils.getJsonValue(selection, 'serviceName')
      const service = services.find(s => s.uuid === selection.serviceId)
      serviceName = service ? service.name : serviceName
      arr.push({ name: `Service: ${serviceName}`, value: this.getActionText(selection, pipelines, artifactSources) })
    }
    return <NameValueList customWidths={['18%', '82%']} data={arr} />
  }
}



// WEBPACK FOOTER //
// ../src/containers/TriggerPage/TriggerUtils.js