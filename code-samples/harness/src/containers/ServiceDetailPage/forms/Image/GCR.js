import { ArtifactStreamService } from 'services'
import { fetchBuildSourceJobPaths, fetchBuildSourceRegions } from '../Shared/SharedDataProviders'
// import { ArtifactSelect } from '../Shared/SharedWidgets'

export const dependencyFieldOrder = []

export const layoutFieldOrder = ['registryHostName', 'dockerImageName']

export const schema = {
  properties: {
    registryHostName: {
      type: 'string',
      title: 'Registry Host Name'
    },

    dockerImageName: {
      type: 'string',
      title: 'Docker Image Name'
    },

    serviceId: {
      type: 'string'
    }
  },
  required: ['registryHostName', 'dockerImageName'],
  dataProviders: {
    fetchBuildSourceJobPaths,
    fetchBuildSourceRegions
  }
}

export const uiSchema = {
  registryHostName: {},
  imageName: {},

  serviceId: {
    'ui:widget': 'hidden'
  }
}

export const widgets = {}

export const eventHandlers = form => ({
  onInitializeForm: async form => {
    const artifactPaths = form.getFieldValue('artifactPaths')
    form.setFieldValue('artifactPaths', artifactPaths instanceof Array ? artifactPaths[0] : artifactPaths)
    form.buffer.schema.properties.settingId.title = 'Cloud Provider'
  },

  onChange: async ({ form, formData }) => {},

  onSubmit: async ({ formData }) => {
    //  formData.sourceName = `${formData.registryHostName}/${formData.dockerImageName}`
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
// ../src/containers/ServiceDetailPage/forms/Image/GCR.js