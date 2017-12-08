import css from '../../ArtifactSourceModal.css'
import { CreatableMultiSelect, SearchableSelect } from 'components'
import { ArtifactStreamService } from 'services'
import { fetchBuildSourceJobs, fetchBuildSourceJobPaths, fetchBuildSourcePlans } from '../Shared/SharedDataProviders'
import { ArtifactSelect } from '../Shared/SharedWidgets'

export const dependencyFieldOrder = ['jobname', 'artifactPaths']
export const layoutFieldOrder = ['jobname', 'metadataOnly', 'artifactPaths']

export const schema = {
  properties: {
    jobname: {
      type: 'string',
      title: 'Plan Name',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchBuildSourceJobs'
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
    fetchBuildSourceJobPaths,
    fetchBuildSourcePlans
  }
}

export const uiSchema = {
  jobname: {
    'ui:widget': 'SearchableSelect'
  },

  metadataOnly: {},
  artifactPaths: {
    title: 'Artifact Path',
    classNames: css['artifact-path-services'],
    // 'ui:widget': 'ArtifactSelect'
    'ui:widget': 'CreatableMultiSelect'
  },

  serviceId: {
    'ui:widget': 'hidden'
  }
}

export const widgets = {
  SearchableSelect,
  ArtifactSelect,
  CreatableMultiSelect
}

export const eventHandlers = form => ({
  onInitializeForm: async form => {
    const artifactPaths = form.getFieldValue('artifactPaths')
    form.setFieldValue('artifactPaths', artifactPaths instanceof Array ? artifactPaths[0] : artifactPaths)
  },

  onChange: async ({ form, formData }) => {
    if (form.isFieldChanged('metadataOnly')) {
      if (formData.metadataOnly === true) {
        form.setRequired(['artifactPaths'], false)
        form.disableFields(['artifactPaths'])
        // formData.artifactPaths = ''
      } else {
        form.setRequired(['artifactPaths'], true)
        form.enableFields(['artifactPaths'])
      }
    }
  },

  onSubmit: async ({ formData }) => {
    const artifactPaths = formData.artifactPaths || ''

    // formData.sourceName = form.getEnumNameFromValue('jobname')
    formData.artifactPaths = artifactPaths.split(',') // formData.artifactPaths = [formData.artifactPaths]
    if (formData.metadataOnly === true) {
      formData.artifactPaths = ['']
    }
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
// ../src/containers/ServiceDetailPage/forms/Package/Bamboo.js