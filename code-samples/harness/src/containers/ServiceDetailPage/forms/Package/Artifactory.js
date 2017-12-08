import css from '../../ArtifactSourceModal.css'

import { ArtifactStreamService } from 'services'
import { SearchableSelect, Utils } from 'components'
import {
  fetchBuildSourceJobs,
  fetchBuildSourceJobPaths,
  fetchBuildSourcePlans,
  fetchRepositoryTypes
} from '../Shared/SharedDataProviders'
import { ArtifactJobSelect } from '../Shared/SharedWidgets'

export const dependencyFieldOrder = ['repositoryType', 'jobname']
export const layoutFieldOrder = ['repositoryType', 'jobname', 'artifactPattern', 'metadataOnly']

export const schema = {
  properties: {
    jobname: {
      type: 'string',
      title: 'Repository',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchBuildSourcePlans'
    },

    repositoryType: {
      type: 'string',
      title: 'Repository Type',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchRepositoryTypes'
    },

    artifactPattern: {
      type: 'string',
      title: 'Artifact Path / File Filter',
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
  required: ['jobname', 'repositoryType', 'artifactPattern'],
  dataProviders: {
    fetchRepositoryTypes,
    fetchBuildSourceJobs,
    fetchBuildSourceJobPaths,
    fetchBuildSourcePlans
  }
}

export const uiSchema = {
  repositoryType: {
    'ui:widget': 'SearchableSelect'
  },

  jobname: {
    'ui:widget': 'SearchableSelect'
  },

  metadataOnly: {},
  artifactPattern: {
    title: 'Artifact Path',
    classNames: css['artifact-path-services'],

    'custom:helpText': Utils.renderHelpTextForPattern(css.toolTipContent)
  },

  serviceId: {
    'ui:widget': 'hidden'
  }
}

export const widgets = {
  ArtifactJobSelect,
  SearchableSelect
}

export const eventHandlers = form => ({
  onInitializeForm: async form => {
    const artifactPattern = form.getFieldValue('artifactPattern')
    form.setFieldValue('artifactPattern', artifactPattern instanceof Array ? artifactPattern[0] : artifactPattern)
  },

  onSubmit: async ({ formData, form }) => {
    /*  formData.sourceName = form.getEnumNameFromValue('jobname')

    if (formData.artifactPattern) {
      formData.sourceName += `/${formData.artifactPattern}`
    }*/
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
// ../src/containers/ServiceDetailPage/forms/Package/Artifactory.js