import css from '../../ArtifactSourceModal.css'
import { SearchableSelect } from 'components'
import { ArtifactStreamService } from 'services'
import {
  fetchBuildSourceJobs,
  fetchBuildSourceJobPaths,
  fetchBuildSourcePlans,
  fetchBuildSourceJobGroups
} from '../Shared/SharedDataProviders'
import { ArtifactSelect } from '../Shared/SharedWidgets'

export const dependencyFieldOrder = ['jobname', 'groupId', 'artifactPaths']
export const layoutFieldOrder = ['jobname', 'groupId', 'artifactPaths', 'metadataOnly']

export const schema = {
  properties: {
    jobname: {
      type: 'string',
      title: 'Repository',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchBuildSourcePlans'
    },

    groupId: {
      type: 'string',
      title: 'Group',
      'custom:dataProvider': 'fetchBuildSourceJobGroups',
      'custom:allowCustomValue': true
    },

    artifactPaths: {
      type: 'string',
      title: 'Artifact Path',
      'custom:dataProvider': 'fetchBuildSourceJobPaths'
    },

    metadataOnly: {
      type: 'boolean',
      title: 'Meta-data Only (Artifact download not required)'
    },

    serviceId: {
      type: 'string'
    }
  },
  required: ['artifactPaths', 'jobname', 'groupId'],
  dataProviders: {
    fetchBuildSourceJobs,
    fetchBuildSourcePlans,
    fetchBuildSourceJobGroups,
    fetchBuildSourceJobPaths
  }
}

export const uiSchema = {
  jobname: { 'ui:widget': 'SearchableSelect' },
  groupId: { 'ui:widget': 'SearchableSelect' },
  metadataOnly: {},
  artifactPaths: {
    title: 'Artifact Path',
    classNames: css['artifact-path-services'],
    'ui:widget': 'ArtifactSelect'
  },
  serviceId: {
    'ui:widget': 'hidden'
  }
}

export const widgets = {
  ArtifactSelect,
  SearchableSelect
}

export const eventHandlers = form => ({
  onInitializeForm: async form => {
    const artifactPaths = form.getFieldValue('artifactPaths')
    const groupId = form.getFieldValue('groupId')

    form.setFieldValue('artifactPaths', artifactPaths instanceof Array ? artifactPaths[0] : artifactPaths)
    form.setFieldValue('groupId', groupId)
  },

  onSubmit: async ({ formData }) => {
    /*    const jobName = form.getEnumNameFromValue('jobname')
    const group = formData.groupId
    const artifactPaths = ((formData.artifactPaths || '').startsWith('/') ? '' : '/') + formData.artifactPaths

     formData.sourceName = `${jobName}/${group}${artifactPaths}`*/

    formData.artifactPaths = [formData.artifactPaths]
    formData.serviceId = form.props.serviceId
    delete formData.key
    delete formData.artifactStreamAttributes

    formData.autoApproveForProduction = true

    return await ArtifactStreamService.updateOrCreateArtifactStream(
      { appId: form.props.appId, artifactStreamId: formData.uuid },
      formData
    )
  }
})



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/forms/Package/Nexus.js