import React from 'react'
import { MenuItem, Dropdown, PanelGroup, Panel, FormControl } from 'react-bootstrap'
import Utils from '../Utils/Utils'
import css from './ServiceArtifactSelect.css'

const selectArtifact = 'Select Build / Version'
const noArtifactMessage = 'No Artifact Available'
const ARTIFACT_TYPES = {
  WAR: 'WAR',
  JENKINS: 'JENKINS',
  DOCKER: 'DOCKER',
  ECR: 'ECR',
  ARTIFACTORY: 'ARTIFACTORY',
  RPM: 'RPM',
  NEXUS: 'NEXUS',
  BAMBOO: 'BAMBOO',
  GCR: 'GCR' // adding bamboo artifact soiurce
}
const ARTIFACT_METATYPES = {
  JENKINS: 'Build# ',
  DOCKER: 'Tag Name: ',
  ECR: 'Tag Name: ',
  ARTIFACTORY_DOCKER: 'Tag Name: ',
  ARTIFACTORY_NONRPM: 'Version: ',
  ARTIFACTORY_RPM: '',
  NEXUS: 'Version: ',
  NEXUS_DOCKER: 'Tag Name: ',
  BAMBOO: 'Build# ',
  WAR: 'Build# ',
  GCR: 'Tag Name: ' // defining metadata to bamboo artifact souce
}
class ServiceArtifactSelect extends React.Component {
  state = {
    menuOpen: false,
    dropdownClass: '',
    servicesMenuOpen: {},
    selectedArtifactObj: {},
    expandObject: {},
    selectedClassObj: {},
    panelSelectedObj: {},
    expandIndex: 0,
    artifacts: {}
  }
  _forceOpen = []
  fromChild = false
  dropDownClassName
  selectedArtifactStreams = []

  /* Component logic comes from
      https://github.com/react-bootstrap/react-bootstrap/issues/1490 */

  /*

    We use bootstrap panel here
    so we maintain which panel has to be expanded and selected by default
  panelSelectedObj => shows which panel is selected
    expandObj => shows which panel has to be expanded by default
    selectedClassObj => maintains list of service/streams which should have selected class
    selectedArtifactObj => maintains list of service/streas which fills the
    selected artifact filled with modified metadata
  */

  componentWillReceiveProps (newProps) {}

  componentWillMount () {
    const { services, artifacts, serviceObj } = this.fillUniqueServiceAndArtifacts()
    this.setState({
      services,
      artifacts
    })
    this.serviceObj = serviceObj
    this.fillInitialValue(artifacts)
    this.fillServicesMenuOpenObject(services)
    this.fillExpansionObject(artifacts)
  }

  /*
    Grouping artifact streams and artifacts together
    making a response object as each artifact stream has ids under it
  */

  fillUniqueServiceAndArtifacts = () => {
    const groupedServiceArtifactStreams = this.props.groupedServiceArtifactStreams
    if (this.props.groupedServiceArtifactStreams) {
      const { serviceObj } = groupedServiceArtifactStreams
      const serviceNames = groupedServiceArtifactStreams ? Object.keys(groupedServiceArtifactStreams.serviceObj) : []
      // groupedServiceArtifactStreams.serviceNames : []
      const resultObj = groupedServiceArtifactStreams ? groupedServiceArtifactStreams.groupedArtifacts : []
      /* const uniqServices = new Set(serviceNames)
      const serviceArray = Array.from(uniqServices)*/

      return { services: serviceNames, artifacts: resultObj, serviceObj }
    } else {
      return { services: this.props.services, artifacts: this.props.artifacts }
    }
  }

  componentDidMount () {}

  /*
    This method helps to build or to group artifacts under artifactStreams
    made this as static as we call this method from pipelines and workflows
    as we need this object as enum and enumNames
  */
  static groupArtifactBuildsByService = (serviceList, artifacts, streamData) => {
    const serviceNames = []

    const serviceObj = {}

    let groupedArtifacts = {}

    for (const service of serviceList) {
      const serviceId = service.uuid

      serviceNames.push(service.name)
      serviceObj[service.name] = serviceId

      if (artifacts) {
        const filteredArtifacts = artifacts.filter(artifact => artifact.serviceIds.indexOf(serviceId) > -1)

        if (filteredArtifacts.length > 0) {
          for (const artifact of filteredArtifacts) {
            const artifactStreamObj = streamData.find(item => item.uuid === artifact.artifactStreamId)
            groupedArtifacts = ServiceArtifactSelect.getGroupedArtifactsByService(
              service,
              artifact,
              artifactStreamObj,
              groupedArtifacts
            )
          }
        } else {
          groupedArtifacts[service.name] = {}
        }
      }
    }
    return { groupedArtifacts, serviceNames, serviceObj }
  }
  /*
    Helper method to group artifacts under artifactstreams
  */
  static getGroupedArtifactsByService = (service, artifact, artifactStreamObj, groupedArtifacts) => {
    if (service) {
      if (!groupedArtifacts.hasOwnProperty(service.name)) {
        groupedArtifacts[service.name] = {}
      }

      if (artifactStreamObj) {
        const compArtifactSourceName = artifactStreamObj.parentJobName
          ? `${artifactStreamObj.parentJobName}/${artifactStreamObj.sourceName}`
          : artifactStreamObj.sourceName

        if (!groupedArtifacts[service.name].hasOwnProperty(compArtifactSourceName)) {
          groupedArtifacts[service.name][compArtifactSourceName] = {}
        }

        const artifactMetaData = groupedArtifacts[service.name][compArtifactSourceName]

        const artifactType = artifactStreamObj.artifactStreamType
        const repositoryType = artifactStreamObj.repositoryType
        const modifiedMetaData = ServiceArtifactSelect.modifyArtifactMetaData(
          artifact.uuid,
          artifactType,
          artifact,
          service,
          repositoryType
        )

        if (artifact.artifactSourceName !== artifactStreamObj.sourceName) {
          modifiedMetaData.forEach(
            (label, index) => (modifiedMetaData[index] += ` (Source: ${artifact.artifactSourceName})`)
          )
        }

        if (!artifactMetaData.hasOwnProperty(artifact.uuid)) {
          groupedArtifacts[service.name][compArtifactSourceName][artifact.uuid] = {}
        }

        groupedArtifacts[service.name][compArtifactSourceName][artifact.uuid] = modifiedMetaData
      }
    }

    return groupedArtifacts
  }

  /*
    Each artifact which is listed under stream
    needs to show build number/tag based on artifact type
  */
  static modifyArtifactMetaData = (uuid, artifactType, artifact, service, repositoryType = null) => {
    const result = []
    const metadata = artifact.metadata
    const descr = artifact.description ? ' - ' + artifact.description + '' : ''

    Object.keys(metadata).map(key => {
      if (key === 'buildNo') {
        const val = metadata[key]
        const serviceArtifactType = service.artifactType
        let updatedValue = ''
        if (artifactType === ARTIFACT_TYPES.NEXUS) {
          updatedValue = ServiceArtifactSelect.returnMetadataForNexus(artifactType, serviceArtifactType)
        } else if (artifactType !== ARTIFACT_TYPES.ARTIFACTORY) {
          updatedValue = ServiceArtifactSelect.returnMetadataTypeForNonArtifactory(artifactType)
        } else {
          updatedValue = ServiceArtifactSelect.returnMetadataForArtifactory(
            artifactType,
            serviceArtifactType,
            repositoryType
          )
        }

        if (updatedValue) {
          updatedValue += val + descr
        } else {
          updatedValue = val + descr
        }

        result.push(updatedValue)
      }
    })
    return result
  }
  // helper methods for artifactory ,it uses repotype to show metadata
  static returnMetadataTypeForNonArtifactory = artifactType => {
    return artifactType !== ARTIFACT_TYPES.RPM ? ARTIFACT_METATYPES[artifactType] : ''
  }
  // helper methods for artifactory ,it uses repotype to show metadata
  static returnMetadataForArtifactory = (artifactType, serviceArtifactType, repositoryType) => {
    let artifactEnumType

    if (repositoryType && repositoryType === 'maven') {
      artifactEnumType = `${ARTIFACT_METATYPES.ARTIFACTORY_NONRPM}`
      return artifactEnumType
    } else {
      artifactEnumType = `${artifactType}_${serviceArtifactType}`
      return ARTIFACT_METATYPES[artifactEnumType]
    }
  }

  // helper method for rendering metadata for nexus and also for nexus3
  static returnMetadataForNexus = (artifactType, serviceArtifactType) => {
    if (serviceArtifactType === ARTIFACT_TYPES.DOCKER) {
      const artifactEnumType = `${artifactType}_${serviceArtifactType}`
      return ARTIFACT_METATYPES[artifactEnumType]
    } else {
      return ARTIFACT_METATYPES[artifactType]
    }
  }

  /* This method is used for rerun to fill the selected value
    and selected artifact stream and assign the selected classes to them
   */
  filterArtifactSelectValue = (service, artifactStreamObj) => {
    const selectedFormArtifacts = this.props.selectedArtifacts
    let selectedVal
    let selectedArtifact
    if (selectedFormArtifacts && selectedFormArtifacts.length > 0) {
      Object.keys(artifactStreamObj).map(stream => {
        const artifactObj = artifactStreamObj[stream]
        Object.keys(artifactObj).map(artifact => {
          if (selectedFormArtifacts.includes(artifact)) {
            const metadata = artifactObj[artifact].join('')
            selectedVal = `${stream}(${metadata})`
            selectedArtifact = artifact
            return selectedVal
          }
        })
        if (selectedVal !== '') {
          return { selectedVal, selectedArtifact }
        }
      })
    }

    return { selectedVal, selectedArtifact }
  }

  /*
    filling all the objects with servicenames creating default objeects
    which gets filled later on based on user clearSelection
  */

  fillInitialValue = artifacts => {
    const selectedArtifactObj = Utils.clone(this.state.selectedArtifactObj)

    Object.keys(artifacts).map(serviceKey => {
      const keyLen = Object.keys(artifacts[serviceKey]).length
      const { selectedVal, selectedArtifact } = this.filterArtifactSelectValue(serviceKey, artifacts[serviceKey])

      if (!selectedArtifactObj.hasOwnProperty(serviceKey) && keyLen > 0) {
        selectedArtifactObj[serviceKey] = {}
        selectedArtifactObj[serviceKey]['uuid'] = selectedArtifact ? selectedArtifact : ''
        selectedArtifactObj[serviceKey]['metaInfo'] = selectedVal ? selectedVal : selectArtifact
        selectedArtifactObj[serviceKey]['className'] = selectedVal ? css.artifactName : css.initialText
        selectedArtifactObj[serviceKey]['disabled'] = false
      } else if (keyLen === 0) {
        selectedArtifactObj[serviceKey] = {}
        selectedArtifactObj[serviceKey]['metaInfo'] = noArtifactMessage
        selectedArtifactObj[serviceKey]['className'] = css.disableText
        selectedArtifactObj[serviceKey]['disabled'] = true
      }
    })
    const { panelSelectedObj, selectedClassObj } = this.addSelectedClassesToSelectedArtifact(artifacts)

    this.setState({ selectedArtifactObj, panelSelectedObj, selectedClassObj })
  }

  /*
   For Rerun case , when there are selected artifacts available
   all the selected artifacts should have the selected class
   so groupong all the selected artifacts
  */
  addSelectedClassesToSelectedArtifact = artifacts => {
    const selectedFormArtifacts = this.props.selectedArtifacts
    const panelSelectedObj = {}
    const selectedClassObj = {}
    if (selectedFormArtifacts && selectedFormArtifacts.length > 0) {
      Object.keys(artifacts).map(service => {
        const { selectedVal, selectedArtifact } = this.filterArtifactSelectValue(service, artifacts[service])
        if (selectedVal && selectedArtifact) {
          panelSelectedObj[service] = {}

          panelSelectedObj[service][selectedArtifact] = {}
          panelSelectedObj[service][selectedArtifact] = css.selected
          selectedClassObj[service] = {}
          selectedClassObj[service][selectedArtifact] = {}
          selectedClassObj[service][selectedArtifact] = css.selected
          this.selectedArtifactStreams.push(selectedArtifact)
        }
      })
    }
    return { panelSelectedObj, selectedClassObj }
  }

  // find selected artifact from the service artifacts

  fillExpansionObject = artifacts => {
    const expandObject = Utils.clone(this.state.expandObject)
    this.setExpandObject(expandObject, artifacts)
  }

  /*
    Finds out if artifact is selected or not
  */
  isArtifactStreamSelected = artifactStreamObj => {
    const selectedFormArtifacts = this.props.selectedArtifacts
    let selectedStream = false
    if (selectedFormArtifacts && selectedFormArtifacts.length > 0) {
      Object.keys(artifactStreamObj).map(artifact => {
        if (selectedFormArtifacts.indexOf(artifact) > -1) {
          selectedStream = true
        }
      })
    }
    return selectedStream
  }

  setExpandObject = (expandObject, artifacts) => {
    // for the regular execution ,first artifact has to be expanded by default
    if (!this.props.selectedArtifacts || this.props.selectedArtifacts.length === 0) {
      expandObject = this.setExpansionForNewExecution(expandObject, artifacts)
    } else {
      // for rerun selected stream has to be expanded
      expandObject = this.setExpansionForReRun(expandObject, artifacts)
    }
    this.setState({ expandObject })
  }

  /*
   for new execution -> the first panel has to be selected by default
  */
  setExpansionForNewExecution = (expandObject, artifacts) => {
    let firstPanel = 0
    // const artifacts = this.props.artifacts
    Object.keys(artifacts).map(serviceKey => {
      const serviceArtifactsArr = artifacts[serviceKey]
      if (!expandObject.hasOwnProperty(serviceKey)) {
        expandObject[serviceKey] = {}
        firstPanel = 0
      }
      const isPanelSelected = this.isPanelSelected(serviceKey)
      Object.keys(serviceArtifactsArr).map(source => {
        if (!expandObject[serviceKey].hasOwnProperty(source)) {
          expandObject[serviceKey][source] = {}
          expandObject[serviceKey][source].expanded = this.setExpansion(isPanelSelected, firstPanel)

          expandObject[serviceKey][source].className = expandObject[serviceKey][source].expanded ? 'expanded' : ''
        }
        firstPanel++
      })
    })
    return expandObject
  }

  /*
    For rerun -> whatever the panel that is selected that should be expanded
    each panel indicates -> artifactstream
    consider if we have three panels and you have selected 2nd panel's first artifact
    on rerun 2nd panel has to be expanded by default
  */

  setExpansionForReRun = (expandObject, artifacts) => {
    let firstPanel = 0
    if (artifacts) {
      Object.keys(artifacts).map(serviceKey => {
        if (!expandObject.hasOwnProperty(serviceKey)) {
          expandObject[serviceKey] = {}
        }
        const serviceArtifactsArr = artifacts[serviceKey]
        const isPanelSelected = this.isPanelSelected(serviceKey)
        Object.keys(serviceArtifactsArr).map(source => {
          const isSelectedArtifactStream = this.isArtifactStreamSelected(serviceArtifactsArr[source])
          if (!expandObject[serviceKey].hasOwnProperty(source)) {
            expandObject[serviceKey][source] = {}
            expandObject[serviceKey][source].expanded =
              isSelectedArtifactStream || isPanelSelected || firstPanel === 0 ? true : false
            expandObject[serviceKey][source].className = expandObject[serviceKey][source].expanded ? 'expanded' : ''
            firstPanel++
          }
        })
      })
    }
    return expandObject
  }

  /*
    If panelisSelected or if it is firstpanel
    set expansion to be true
  */

  setExpansion = (isPanelSelected, firstPanel) => {
    if (!isPanelSelected && firstPanel === 0) {
      return true
    } else {
      return false
    }
  }

  isPanelSelected = service => {
    const panelSelectedObj = Utils.clone(this.state.panelSelectedObj)
    if (!panelSelectedObj.hasOwnProperty(service)) {
      return false
    } else {
      return true
    }
  }

  /*
    For each service we maitain a menu open object
    to indicate if we can close it or not
  */
  fillServicesMenuOpenObject = servicesArray => {
    const servicesOpenObj = {}
    for (const service of servicesArray) {
      if (!servicesOpenObj.hasOwnProperty(service)) {
        servicesOpenObj[service] = {}
        servicesOpenObj[service].menuOpen = false
        this._forceOpen[service] = {}
        this._forceOpen[service].open = false
      }
    }
    this.setState({ servicesMenuOpen: servicesOpenObj })
  }

  stopPropagation (e) {
    e.stopPropagation()
  }

  emptyServiceSelectObj = () => {}

  /*
    toggling the open close of dropdown
    and filling the expansion object accordingly
    when you click the secondpanel -> first panel should be closed
    and it has to be expanded
  */
  dropdownToggle = (newValue, service) => {
    // console.log(this.state.servicesMenuOpen)
    const servicesOpenObj = Utils.clone(this.state.servicesMenuOpen)
    this.emptyServiceSelectObj()
    const currentService = servicesOpenObj[service]
    if (this._forceOpen[service].open) {
      currentService.menuOpen = true
      this.setState({ servicesMenuOpen: servicesOpenObj })
      this._forceOpen[service].open = false
    } else {
      if (!this._forceOpen[service].open) {
        this.fillExpansionObject(this.state.artifacts)
      }
      currentService.menuOpen = newValue
      this.setState({ servicesMenuOpen: servicesOpenObj })
    }
  }

  /*
    If the click is not from child
    we should not close the dropdown
    instead it has to expand all open up
    to see the group of artifacts listed under
    i had an issue it was closing when you click on the parent
    so had to maintain fromChild and forceopen object
    and stop it from closing the dropdown if the click is on parent
  */

  menuItemClickedThatShouldntCloseDropdown = service => {
    if (!this.fromChild) {
      this._forceOpen[service].open = true
    }
    this.fromChild = false
  }

  /*
    If this click is from child
    it should close the dropdown
    forceopen object for this service has to be false
    selectedClassObject-> has to be filled with selected artifact(modified metadata)
    and with selected className
    panelSelectedObj for this service has to be filled to indicate which panel(stream)
    has to be expanded when opened again
    selectedArtifactObj -> selectedArtifactObj will have selected value(that is displayed on ui)
    expandObject->sets the expansion to be true for this stream
    this.selectedArtifactStreams => (it maintains a list of artifactstreams
    ui shows (modified metadata with build no)
    but backend needs a list of artifactuuids , this maintains a list of it)
  */

  menuItemShouldCloseDropDown = (service, artifact, key, metaData) => {
    const selectedArtifactObj = Utils.clone(this.state.selectedArtifactObj)
    const selectedClassObj = Utils.clone(this.state.selectedClassObj)
    const panelSelectedObj = Utils.clone(this.state.panelSelectedObj)
    const expandObject = Utils.clone(this.state.expandObject)
    this._forceOpen[service].open = false
    this.fromChild = true

    const selValue = artifact + ' ' + `(${metaData})`
    selectedClassObj[service] = {}
    selectedClassObj[service][key] = css.selected
    if (!selectedArtifactObj[service]) {
      selectedArtifactObj[service] = {}
    }
    this.updateSelectedArtifactStreams(selectedArtifactObj, service)
    selectedArtifactObj[service]['uuid'] = key

    selectedArtifactObj[service].metaInfo = selValue
    selectedArtifactObj[service].className = css.artifactName
    panelSelectedObj[service] = {}
    panelSelectedObj[service][artifact] = css.selected
    expandObject[service][artifact].expanded = true
    this.setState({
      selectedArtifactObj: selectedArtifactObj,
      selectedClassObj,
      panelSelectedObj,
      expandObject
    })

    this.selectedArtifactStreams.push(key)
    this.props.setArtifactsOnFormData(this.selectedArtifactStreams.join(','))
  }

  /*
   selectedArtifactObj(which maintains selected artifactids for the service)
    if selectedArtifactObj for that service already exists removes that id(which was previous selection)
    from selectedArtifactStreams and pushes the new one on menuItemShouldCloseDropDown
  */
  updateSelectedArtifactStreams = (selectedArtifactObj, service) => {
    const selectedArtifactStreams = Utils.clone(this.selectedArtifactStreams)
    const selectedUuid = selectedArtifactObj[service].uuid
    const selIdx = selectedArtifactStreams.indexOf(selectedUuid)
    if (selIdx > -1) {
      selectedArtifactStreams.splice(selIdx, 1)
    }
    this.selectedArtifactStreams = selectedArtifactStreams
  }

  /*
  It collapses all artifacts which are not selected
  */
  collapseOtherArtifacts = (service, selectedArtifact, expandObject) => {
    const serviceObj = expandObject[service]
    Object.keys(serviceObj).map(artifact => {
      if (artifact !== selectedArtifact) {
        const artifactObj = serviceObj[artifact]
        if (artifactObj.expanded) {
          artifactObj.expanded = false
          artifactObj.className = ''
        }
      }
    })
  }

  /*
    When an artifact is selected sets expandedObject
    to have the expansion to be set to true
  */
  onSelectArtifact = (service, artifact) => {
    const expandObject = Utils.clone(this.state.expandObject)
    this.collapseOtherArtifacts(service, artifact, expandObject)
    const boolValue = expandObject[service][artifact].expanded
    expandObject[service][artifact].expanded = !boolValue
    expandObject[service][artifact].className = expandObject[service][artifact].expanded ? 'expanded' : ''
    this.setState({ expandObject })
  }

  getPanelSelectedClass = (service, artifact) => {
    const panelSelectedObj = Utils.clone(this.state.panelSelectedObj)
    const clsName =
      panelSelectedObj.hasOwnProperty(service) && panelSelectedObj[service].hasOwnProperty(artifact)
        ? 'selectedPanel'
        : ''
    return clsName
  }

  /*
    Start of methods for search
    On Search -> handles onchange of it
  */

  handleFilterChange = async (searchVal, service) => {
    const searchedServiceId = this.serviceObj[service]

    this.selectedServiceId = searchedServiceId

    this.setState({ searchVal })

    await this.debouncedApi()
  }

  debouncedApi = Utils.debounce(async () => {
    const apiKey = (this.apiKey = Date.now())

    const response = await this.props.filterArtifactSelectByBuildNumber(this.state.searchVal, this.selectedServiceId)

    if (apiKey === this.apiKey) {
      const { serviceNames, groupedArtifacts } = response

      const currentArtifactList = Utils.clone(this.state.artifacts)
      currentArtifactList[serviceNames[0]] = groupedArtifacts[serviceNames[0]]

      this.setState({ artifacts: currentArtifactList }, () => {
        this.expandAllPanels(currentArtifactList)
      })
    }
  }, 200)

  /*
    When a value is searched , what all the panels has this
    all those panels are expanded by default
  */

  expandAllPanels = artifacts => {
    const expandObject = Utils.clone(this.state.expandObject)
    // const artifacts = this.props.artifacts
    Object.keys(artifacts).map(serviceKey => {
      const serviceArtifactsArr = artifacts[serviceKey]

      Object.keys(serviceArtifactsArr).map(source => {
        // selectedClassObj[source] = ''
        expandObject[serviceKey][source] = {}
        expandObject[serviceKey][source].expanded = true
        expandObject[serviceKey][source].className = expandObject[serviceKey][source].expanded ? 'expanded' : ''
      })
    })
    this.setState({ expandObject /* , selectedClassObj*/ })
  }

  /*
    Search Control is enabled only if totalArtifactStreams<10
    or if total artifactStreams>1
    or if search value is not empty
  */
  canEnableSearch = (artifacts, serviceId) => {
    const artifactStreamLength = Object.keys(artifacts).length
    let totalArtifactStreams = 0

    Object.keys(artifacts).forEach(artifact => {
      const count = Object.keys(artifacts[artifact]).length
      totalArtifactStreams += count
    })
    if (this.state.searchVal && this.selectedServiceId === serviceId) {
      return true
    }
    if (artifactStreamLength > 1) {
      return true
    } else if (totalArtifactStreams > 10) {
      return true
    }
    return false
  }

  renderSearchControl = (artifacts, service) => {
    const serviceId = this.serviceObj[service]
    const isSearchEnabled = this.canEnableSearch(artifacts, serviceId)

    if (isSearchEnabled) {
      return (
        <div className={css.searchControl}>
          <FormControl
            type="text"
            onChange={e => {
              const searchVal = e.currentTarget.value
              this.handleFilterChange(searchVal, service)
            }}
            placeholder="Search a build"
          />
        </div>
      )
    } else {
      return
    }
  }

  /* --------End of search methods-------- */

  /* render panels
    each stream is a panel which will have artifacts grouped under stream
   */
  renderPanels = service => {
    const artifacts = this.state.artifacts[service]
    this.renderSearchControl(artifacts)
    return (
      <div>
        {this.renderSearchControl(artifacts, service)}
        <PanelGroup>
          {Object.keys(artifacts).map(artifact => {
            return (
              <Panel
                title={artifact}
                header={Utils.truncate(artifact, 65)}
                collapsible
                onClick={this.onSelectArtifact.bind(this, service, artifact)}
                expanded={this.state.expandObject[service][artifact].expanded}
                className={`${this.state.expandObject[service][artifact].className}
            ${this.getPanelSelectedClass(service, artifact)}`}
              >
                {this.renderMetaData(artifact, artifacts[artifact], service)}
              </Panel>
            )
          })}
        </PanelGroup>
      </div>
    )
  }

  renderMetaData = (artifact, metaData, service) => {
    return (
      <div className={css.metaContent}>
        {Object.keys(metaData).map(dataKey => {
          return this.renderMetaInfo(artifact, service, metaData[dataKey], dataKey)
        })}
      </div>
    )
  }

  renderMetaInfo = (artifact, service, metaInfo, key) => {
    const selectedClassObj = this.state.selectedClassObj
    const clsName =
      selectedClassObj.hasOwnProperty(service) && selectedClassObj[service].hasOwnProperty(key)
        ? this.state.selectedClassObj[service][key]
        : ''
    return (
      <div key={key} className={css.parentMetaInfo} data-tag="build-artifacts-versions">
        {Object.keys(metaInfo).map(element => {
          const txt = metaInfo[element]
          return (
            <div
              onClick={this.menuItemShouldCloseDropDown.bind(null, service, artifact, key, metaInfo[element])}
              className={`${css.metaInfo} ${clsName}`}
              title={txt}
            >
              {Utils.truncate(txt, 70)}
            </div>
          )
        })}
      </div>
    )
  }

  /*
    When cross mark is clicked all objects has to be cleared
    and should show the place holder as select build/version
  */
  clearSelection = service => {
    const selectedArtifactObj = Utils.clone(this.state.selectedArtifactObj)
    const panelSelectedObj = Utils.clone(this.state.panelSelectedObj)
    const selectedClassObj = Utils.clone(this.state.selectedClassObj)

    this.updateSelectedArtifactStreams(selectedArtifactObj, service)
    selectedArtifactObj[service].uuid = ''
    selectedArtifactObj[service].metaInfo = selectArtifact
    selectedArtifactObj[service].className = css.initialText
    delete panelSelectedObj[service]
    delete selectedClassObj[service]

    this.props.setArtifactsOnFormData(this.selectedArtifactStreams.join(','))
    this.setState({
      selectedArtifactObj,
      selectedClassObj: selectedClassObj,
      panelSelectedObj: panelSelectedObj
    })
    this.resetExpansionOnService(service)
    // this.fillExpansionObject({ 'reset': true, 'service': service })
  }

  resetExpansionOnService = service => {
    const expandObject = Utils.clone(this.state.expandObject)
    // expandObject[service] = {}
    this.setExpandObject(expandObject)
  }

  renderDeleteIcon = service => {
    const clsName = this.state.selectedArtifactObj[service].className
    if (clsName !== css.initialText && clsName !== css.disableText) {
      return (
        <span className={css.clearContent}>
          <i
            className="icons8-delete"
            onClick={event => {
              event.stopPropagation()
              this.clearSelection.call(this, service)
            }}
          >
            {' '}
          </i>
        </span>
      )
    }
  }

  render () {
    /* Component logic comes from
      https://github.com/react-bootstrap/react-bootstrap/issues/1490 */
    return (
      <div className={css.main}>
        <div className={`row ${css.artifactHeader}`}>
          <div className={`col-md-4 ${css.colHeader}`}>Service</div>

          <div className={`col-md-8 ${css.colHeader}`}>Build / Version</div>
        </div>

        {this.state.services &&
          this.state.services.length > 0 &&
          this.state.services.map(item => {
            return (
              <div className={`row ${css.artifactSelectRow}`}>
                <div className={`col-md-4 ${css.serviceName}`}>{item}</div>
                <div className="col-md-8">
                  <Dropdown
                    block
                    open={this.state.servicesMenuOpen[item].menuOpen}
                    onToggle={val => this.dropdownToggle(val, item)}
                    ignoreContentClick={true}
                    disabled={this.state.selectedArtifactObj[item].disabled}
                  >
                    <Dropdown.Toggle block className={css.dropDownToggle}>
                      <span data-name="select-artifact-span">
                        <span
                          className={this.state.selectedArtifactObj[item].className}
                          title={this.state.selectedArtifactObj[item].metaInfo}
                        >
                          {this.state.selectedArtifactObj[item].metaInfo}
                        </span>
                        {this.renderDeleteIcon(item)}
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="artifactSource-Groups" bsRole="menu">
                      <MenuItem
                        eventKey="1"
                        onClick={this.menuItemClickedThatShouldntCloseDropdown.bind(null, item)}
                        className="artifact-item"
                      >
                        {this.renderPanels(item)}
                      </MenuItem>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            )
          })}
      </div>
    )
  }
}

export default ServiceArtifactSelect



// WEBPACK FOOTER //
// ../src/components/ServiceArtifactSelect/ServiceArtifactSelect.js