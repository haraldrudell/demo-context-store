import css from '../../ArtifactSourceModal.css'

import { ArtifactStreamService } from 'services'
import { fetchBuildSourceJobs, fetchBuildSourceJobPaths, fetchBuildSourcePlans } from '../Shared/SharedDataProviders'
import { ArtifactJobSelect, ArtifactSelect } from '../Shared/SharedWidgets'
import { CreatableMultiSelect } from 'components'

export const dependencyFieldOrder = ['jobname', 'artifactPaths']
export const layoutFieldOrder = ['jobname', 'metadataOnly', 'artifactPaths']

export const schema = {
  properties: {
    jobname: {
      type: 'string',
      title: 'Job Name',
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
  artifactPaths: {
    title: 'Artifact Path',
    classNames: css['artifact-path-services'],
    // 'ui:widget': 'ArtifactSelect'
    'ui:widget': 'CreatableMultiSelect'
  },

  jobname: {
    'ui:placeholder': 'Select Plan',
    'ui:widget': 'ArtifactJobSelect'
  },

  metadataOnly: {},

  serviceId: {
    'ui:widget': 'hidden'
  }
}

export const widgets = {
  ArtifactJobSelect,
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
        console.log(form.buffer.uiSchema)
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

    // formData.sourceName = formData.jobname
    formData.artifactPaths = artifactPaths.split(',') // [formData.artifactPaths]
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
// ../src/containers/ServiceDetailPage/forms/Package/Jenkins.js