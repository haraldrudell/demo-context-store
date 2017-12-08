import React, { PropTypes } from 'react'
import { Modal, Row, Col, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import Utils from '../Utils/Utils'
import css from './ManageVersionsModal.css'

export default class ManageVersionsModal extends React.Component {
  state = {}
  data = {}
  envIdVersionMap = {}

  static propTypes = {
    show: PropTypes.bool,
    data: PropTypes.object,
    showVersion: PropTypes.bool,
    environments: PropTypes.array,
    modalTitle: PropTypes.string,
    actionIcon: PropTypes.string,
    versions: PropTypes.array,
    onAction: PropTypes.func,
    onSubmit: PropTypes.func,
    onHide: PropTypes.func
  }

  static defaultProps = {
    modalTitle: 'Manage Version',
    actionIcon: 'icons8-installing-updates-2'
  }

  onAction = (e, version) => {
    e.preventDefault()
    e.stopPropagation()
    const __version = version && version.version ? version.version : this.data.defaultVersion
    this.props.onAction(__version)
  }

  onSelectVersion = (e, version, envId) => {
    e.preventDefault()
    if (envId) {
      this.envIdVersionMap[envId] = version
    } else {
      this.data.defaultVersion = version.version
    }

    this.setState({ __update: Date.now() })
  }

  onSubmit = () => {
    this.data.envIdVersionMap = this.envIdVersionMap
    this.props.onSubmit(this.data)
  }

  onCheckboxChange = (e, envId) => {
    const value = e.target.checked
    if (value) {
      this.envIdVersionMap[envId] = null
    } else {
      delete this.envIdVersionMap[envId]
    }
    this.setState({ __update: Date.now() })
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.init(newProps)
    }
  }

  init (props) {
    if (props.data) {
      this.data = Utils.clone(props.data)
      this.targetToAllEnv = props.data.targetToAllEnv
      this.envIdVersionMap = props.data.envIdVersionMap || {}
    } else {
      this.data = { envIdVersionMap: {} }
      this.envIdVersionMap = this.data.envIdVersionMap
      this.props.environments.map(env => {
        this.envIdVersionMap[env.uuid] = null
      })
    }
    this.setState({ __update: Date.now() })
  }

  renderdropDown (formId, defaultStr = 'default') {
    if (!this.props.showVersion) {
      return null
    }

    const content = (idObject, version = null, isLast = false, key = '_default') =>
      <MenuItem key={key} className="menu-item">
        <span className={'version-name ' + (!version ? '__defaultVersion' : '')} role="menuitem">
          {version ? 'version ' + version.version : 'Set to default'}
          {version &&
            <span className="last-updated">
              {'('}
              {Utils.formatDate(new Date(version.lastUpdatedAt), 'DD-MMM-YYYY')}
              {')'}
            </span>}
        </span>
        {version &&
          <div className="right-content">
            <span className="action-link link-style" onClick={e => this.onSelectVersion(e, version, idObject)}>
              select
            </span>
            <vertical-separator />
            <span className="action-link link-style" onClick={e => this.onAction(e, version)}>
              view
            </span>
          </div>}
      </MenuItem>

    const selected = formId && this.envIdVersionMap ? this.envIdVersionMap[formId] : null
    const versions = Utils.getJsonValue(this, 'props.versions')
    const title = selected ? selected.version : defaultStr

    return (
      <DropdownButton title={`version: ${title}`} id="v-dropdown" bsStyle="link">
        {formId && content(formId)}
        {versions && versions.map((item, i) => content(formId, item, i === versions.length - 1, i))}
      </DropdownButton>
    )
  }

  renderDefaultVersion () {
    if (!this.props.showVersion) {
      return null
    }

    return (
      <span className="menu-header">
        Default Version: {this.renderdropDown(null, Utils.getJsonValue(this, 'data.defaultVersion'))}
      </span>
    )
  }

  renderVersions () {
    const versions = Utils.getJsonValue(this, 'props.versions')
    const className = versions && this.targetToAllEnv ? 'hidden' : ''
    const envList = this.props.environments.map(env => {
      return (
        <div className="checkbox" key={env.uuid}>
          <label>
            <input
              type="checkbox"
              className={className}
              checked={this.envIdVersionMap && this.envIdVersionMap.hasOwnProperty(env.uuid)}
              onChange={e => this.onCheckboxChange(e, env.uuid)}
            />
            <strong>
              {env.name}
            </strong>
          </label>
          {this.renderdropDown(env.uuid)}
        </div>
      )
    })
    return (
      <div>
        {this.renderDefaultVersion()}

        {this.props.showTargetEnv !== false &&
          <div>
            <div className="__targetEnvsLabel">Target Environments:</div>
            <div>
              {envList}
            </div>
          </div>}
      </div>
    )
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>
            Manage Version ({this.props.modalTitle})
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderVersions()}
        </Modal.Body>

        <Modal.Footer>
          <Row className="show-grid">
            <Col xs={6} md={4} className="text-left">
              <Button bsStyle="primary" onClick={this.onSubmit} className="submit-button">
                Submit
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/Versioning/ManageVersionsModal.js