import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { WingsForm, WingsModal } from 'components'
import apis from 'apis/apis'
import moment from 'moment'

const schema = {
  type: 'object',
  required: ['displayName', 'artifactStreamId', 'build'],
  properties: {
    artifactStreamId: { type: 'string', title: 'Artifact Source', default: '' },
    build: { type: 'string', title: 'Build', default: '', enum: [null], enumNames: ['Loading...'] },
    displayName: { type: 'string', title: 'Display Name', default: '' }
  }
}

const uiSchema = {
  artifactStreamId: { 'ui:disabled': true },
  build: { 'ui:disabled': true },
  displayName: { 'ui:placeholder': 'Display Name', 'ui:disabled': true },
  description: { 'ui:placeholder': 'Description' }
}

const log = (type) => {} // console.log.bind(console, type)

export default class ArtifactModal extends React.Component {
  state = {}
  skipOnChange = true
  objArtifactSources = {}
  objBuildDetails = {}
  reqBuildDetailsInProgress = 0

  componentWillReceiveProps (newProps) {
    this.updateState({})

    if (!newProps.show) {
      return
    }

    if (newProps.artifactStreamData) {
      this.updateSchemaArtifactSources(newProps.artifactStreamData)
    }
  }

  onChange = ( { formData }) => {
    if (this.skipOnchange) {
      this.skipOnchange = false
      return
    }

    if (formData.artifactStreamId && formData.artifactStreamId !== this.formData.artifactStreamId ) {
      this.updateDefaultDisplayName(formData)
      this.updateBuildLabel(formData)
      this.updateState(formData)
      this.fetchBuildDetails(formData)
    }
  }

  updateState (formData) {
    this.formData = formData
    this.formData.key = Date.now()
    this.setState({ __update: Date.now() })
  }

  onSubmit = ({ formData }) => {
    const _objBuild = this.objBuildDetails[formData.build]
    const submitData = {
      'displayName': formData.displayName,
      'artifactStreamId': formData.artifactStreamId,
      'metadata': { 'buildNo': formData.build },
      'revision': _objBuild.revision
    }
    console.log('submitting', submitData)
    this.props.onSubmit(submitData)
  }

  updateSchemaArtifactSources (artifactStreamData) {

    if (!artifactStreamData) {
      return
    }

    this.objArtifactSources = {}
    const _arrArtifactSources = artifactStreamData
    const _schemaArtifactSource = schema.properties.artifactStreamId

    delete _schemaArtifactSource['enum']
    delete _schemaArtifactSource['enumNames']
    delete uiSchema.artifactStreamId

    if (_arrArtifactSources.length > 0) {

      _arrArtifactSources.map((artifactSource) => {
        this.objArtifactSources[artifactSource.uuid] = artifactSource
      })
      _schemaArtifactSource.enum = Object.keys(this.objArtifactSources)
      _schemaArtifactSource.enumNames = Object.keys(this.objArtifactSources).map((k) => {
        const parentJobName = this.objArtifactSources[k].parentJobName
        if (parentJobName) {
          return `${parentJobName}/${this.objArtifactSources[k].sourceName}`
        } else {
          return this.objArtifactSources[k].sourceName
        }

      })
      const formData = { 'artifactStreamId': Object.keys(this.objArtifactSources)[0] }

      this.updateBuildLabel(formData)
      this.updateState(formData)
      this.fetchBuildDetails(formData)
      this.updateDefaultDisplayName(formData)

    } else {
      // The release does not have any artifact sources
      _schemaArtifactSource.enum = [null]
      _schemaArtifactSource.enumNames = ['No Artifact Sources are available']
      const formData = { 'artifactStreamId': '' }

      this.updateBuildDetails(null, formData)
    }
  }

  updateBuildDetails (buildDetails, formData) {
    if (this.reqBuildDetailsInProgress > 0) {
      // build request details are still in progres so skip it
      return
    }

    this.objBuildDetails = {}

    if (buildDetails && (buildDetails instanceof Array)) {

      buildDetails.map((build) => {
        this.objBuildDetails[build.number] = build
      })
      const _dropDownValues = Object.keys(this.objBuildDetails).reverse()

      schema.properties.build.enum = _dropDownValues
      schema.properties.build.enumNames = _dropDownValues
      schema.properties.build.default = _dropDownValues[0]
      formData.build = _dropDownValues[0]
    } else {
      // The release does not have any artifact sources
      schema.properties.build.enum = [null]
      schema.properties.build.enumNames = ['No Builds are available']
      formData.build = ''
    }

    delete uiSchema.build
    delete uiSchema.artifactStreamId
    delete uiSchema.displayName
    this.updateState(formData)
  }

  updateBuildLabel = (formData) => {

    uiSchema.build = { 'ui:disabled': true }
    schema.properties.build.enum = [null]
    schema.properties.build.enumNames = ['Loading...']
    uiSchema.artifactStreamId = { 'ui:disabled': true }

    if (!formData || !formData.artifactStreamId) {
      return
    }
    const artifactStreamId = formData.artifactStreamId
    const _objArtifactSource = this.objArtifactSources[artifactStreamId]
    const artifactStreamType = _objArtifactSource.artifactStreamType

    if (artifactStreamType === 'NEXUS') {
      schema.properties.build.title = 'Version'
    } else if (artifactStreamType === 'ARTIFACTORY') {
      schema.properties.build.title = 'Artifact / Tag'
    } else {
      schema.properties.build.title = 'Build'
    }
    this.setState({ __update: Date.now() })
  }

  fetchBuildDetails = (formData) => {

    if (!formData || !formData.artifactStreamId) {
      return
    }

    const appId = this.props.appIdFromUrl
    const artifactStreamId = formData.artifactStreamId
    const _objArtifactSource = this.objArtifactSources[artifactStreamId]
    const sourceSettingId = _objArtifactSource.settingId

    this.reqBuildDetailsInProgress = this.reqBuildDetailsInProgress + 1
    apis.service.list(apis.getBuildNumbersEndPoint(appId, artifactStreamId, sourceSettingId))
      .then((res) => {
        this.reqBuildDetailsInProgress = this.reqBuildDetailsInProgress - 1
        if (res.resource) {
          this.updateBuildDetails(res.resource, formData)
        } else {
          log('No Builds available')
          this.updateBuildDetails(null, formData)
        }

      })
      .catch(error => {
        this.reqBuildDetailsInProgress = this.reqBuildDetailsInProgress - 1
        this.updateBuildDetails(null, formData)
        throw error
      })
  }

  updateDefaultDisplayName (formData) {
    // TODO : if user updated dsiplayName do not change it.

    if (formData.artifactStreamId && formData.artifactStreamId.length > 0) {
      const _objArtifactSource = this.objArtifactSources[formData.artifactStreamId]
      const artifactStreamType = _objArtifactSource.artifactStreamType
      const _name = []
      if (artifactStreamType === 'NEXUS') {
        // Display name should be from artifact paths
        _name.push(_objArtifactSource.artifactPaths[0])
      } else {
        _name.push(_objArtifactSource.sourceName)
      }
      _name.push(moment().format('MMMM_DD_h_mm_a').toLowerCase())
      formData.displayName = _name.join('_')
    }
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Release Artifacts</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <WingsForm name="Artifact" ref="form" schema={schema} uiSchema={uiSchema}
            formData={this.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          >
            <Button bsStyle="default" type="submit" className="submit-button">
              SUBMIT
            </Button>
          </WingsForm>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ArtifactPage/ArtifactModal.js