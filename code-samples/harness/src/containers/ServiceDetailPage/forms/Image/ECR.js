import { SearchableSelect } from 'components'
import { ArtifactStreamService } from 'services'
import { fetchBuildSourceJobPaths, fetchBuildSourceRegions } from '../Shared/SharedDataProviders'
import { ArtifactSelect } from '../Shared/SharedWidgets'

export const dependencyFieldOrder = ['region', 'imageName']

export const layoutFieldOrder = ['region', 'imageName']

export const schema = {
  properties: {
    region: {
      type: 'string',
      title: 'Region',
      enum: [],
      enumNames: [],
      'custom:dataProvider': 'fetchBuildSourceRegions'
    },

    imageName: {
      type: 'string',
      title: 'Docker Image Name',
      'custom:dataProvider': 'fetchBuildSourceJobPaths'
    },

    serviceId: {
      type: 'string'
    }
  },
  required: ['imageName'],
  dataProviders: {
    fetchBuildSourceJobPaths,
    fetchBuildSourceRegions
  }
}

export const uiSchema = {
  region: { 'ui:widget': 'SearchableSelect' },
  imageName: { 'ui:widget': 'ArtifactSelect' },

  serviceId: {
    'ui:widget': 'hidden'
  }
}

export const widgets = { SearchableSelect, ArtifactSelect }

export const eventHandlers = form => ({
  onInitializeForm: async form => {
    const artifactPaths = form.getFieldValue('artifactPaths')
    form.setFieldValue('artifactPaths', artifactPaths instanceof Array ? artifactPaths[0] : artifactPaths)
    form.buffer.schema.properties.settingId.title = 'Cloud Provider'
  },

  onChange: async ({ form, formData }) => {},

  onSubmit: async ({ formData }) => {
    // formData.sourceName = formData.imageName
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
// ../src/containers/ServiceDetailPage/forms/Image/ECR.js