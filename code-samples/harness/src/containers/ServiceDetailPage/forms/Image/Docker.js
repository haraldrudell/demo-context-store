import { ArtifactStreamService } from 'services'
import { fetchBuildSourceJobPaths } from '../Shared/SharedDataProviders'
// import { ArtifactSelect } from '../Shared/SharedWidgets'

export const dependencyFieldOrder = ['imageName']
export const layoutFieldOrder = ['imageName']

export const schema = {
  properties: {
    imageName: {
      type: 'string',
      title: 'Docker Image Name'
      //  'custom:dataProvider': 'fetchBuildSourceJobPaths'
    },

    serviceId: {
      type: 'string'
    }
  },
  required: ['imageName'],
  dataProviders: {
    fetchBuildSourceJobPaths
  }
}

export const uiSchema = {
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
  },

  onChange: async ({ form, formData }) => {},

  onSubmit: async ({ formData }) => {
    //  formData.sourceName = formData.imageName
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
// ../src/containers/ServiceDetailPage/forms/Image/Docker.js