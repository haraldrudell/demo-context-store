import { SearchableSelect } from 'components'
import { ArtifactStreamService } from 'services'
import {
  fetchBuildSourceJobPaths,
  fetchBuildSourcePlans,
  fetchBuildSourceJobGroups
} from '../Shared/SharedDataProviders'
import { ArtifactSelect } from '../Shared/SharedWidgets'

export const dependencyFieldOrder = ['jobname', 'groupId']

export const layoutFieldOrder = ['jobname', 'groupId']

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
      title: 'Docker Image Name',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchBuildSourceJobGroups'
    },

    serviceId: {
      type: 'string'
    }
  },
  required: ['jobname', 'groupId'],
  dataProviders: {
    fetchBuildSourceJobPaths,
    fetchBuildSourcePlans,
    fetchBuildSourceJobGroups
  }
}

export const uiSchema = {
  jobname: { 'ui:widget': 'SearchableSelect' },
  groupId: { 'ui:widget': 'SearchableSelect' },

  serviceId: {
    'ui:widget': 'hidden'
  }
}

export const widgets = { SearchableSelect, ArtifactSelect }

export const eventHandlers = form => ({
  onInitializeForm: async form => {
    const artifactPaths = form.getFieldValue('artifactPaths')
    form.setFieldValue('artifactPaths', artifactPaths instanceof Array ? artifactPaths[0] : artifactPaths)
  },

  onChange: async ({ form, formData }) => {},

  onSubmit: async ({ formData }) => {
    //  formData.sourceName = `${form.getEnumNameFromValue('jobname')}/${form.getEnumNameFromValue('groupId')}`
    formData.serviceId = form.props.serviceId
    formData.autoApproveForProduction = true

    delete formData.key
    delete formData.artifactStreamAttributes

    return await ArtifactStreamService.updateOrCreateArtifactStream(
      { appId: form.props.appId, artifactStreamId: formData.uuid },
      formData
    )
  }
})



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/forms/Image/Artifactory.js