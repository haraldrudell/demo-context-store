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

export const dependencyFieldOrder = ['jobname', 'artifactPaths']
export const layoutFieldOrder = ['jobname', 'artifactPaths', 'metadataOnly']

export const schema = {
  properties: {
    jobname: {
      type: 'string',
      title: 'Bucket',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchBuildSourcePlans'
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
  required: ['artifactPaths', 'jobname'],
  dataProviders: {
    fetchBuildSourceJobs,
    fetchBuildSourcePlans,
    fetchBuildSourceJobGroups,
    fetchBuildSourceJobPaths
  }
}

export const uiSchema = {
  jobname: {
    'ui:widget': 'SearchableSelect'
  },

  metadataOnly: { 'ui:readonly': true },

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
    form.setFieldValue('artifactPaths', artifactPaths instanceof Array ? artifactPaths[0] : artifactPaths)
    form.buffer.schema.properties.settingId.title = 'Cloud Provider'
    form.buffer.formData.metadataOnly = true
  },

  onSubmit: async ({ formData }) => {
    /*  formData.sourceName = form.getEnumNameFromValue('jobname')
    if (formData.artifactPaths) {
      formData.sourceName += `/${formData.artifactPaths}`
    }*/
    formData.artifactPaths = [formData.artifactPaths]
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
// ../src/containers/ServiceDetailPage/forms/Package/AmazonS3.js