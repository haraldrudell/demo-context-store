import React from 'react'
import { MenuItem, Dropdown } from 'react-bootstrap'
import css from './ArtifactJobSelection.css'
import apis from '../../apis/apis'
import Utils from '../Utils/Utils'
const placeHolder = 'Select an option'
class ArtifactJobSelection extends React.Component {
  state = {
    open: false,
    folderJobList: {},
    initialised: false,
    selectedJob: placeHolder
  }
  isFolder = false

  async componentWillMount () {
    if (!this.state.initialised) {
      await this.init(this.props.jobList)
      this.setState({ initialised: true })
    }
  }

  async componentWillReceiveProps (newProps) {
    await this.init(newProps.jobList)
  }

  init = async jobList => {
    await this.fillFolderJobList(jobList)
    this.setSelectedJobName()
  }

  setSelectedJobName = () => {
    const jobName = this.props.jobName || placeHolder
    const parentJobName = this.props.parentJobName

    const selectedJob = parentJobName ? `${parentJobName}/${jobName}` : jobName
    this.setState({ selectedJob })
  }

  fillFolderJobList = async jobList => {
    await new Promise(resolve => {
      const updateFolderJobListState = prevState => {
        const folderJobList = Utils.clone(prevState.folderJobList)
        jobList.forEach(job => {
          const isFolder = job.folder
          const jobName = job.jobName
          if (isFolder) {
            folderJobList[jobName] = {}
            folderJobList[jobName].expanded = false
          }
        })

        return { folderJobList }
      }

      const afterSetState = () => {
        const path = this.props.jobName
        if (this.hasParentInJobPath(path)) {
          const parentJobName = this.getParentJobName(path)
          this.onFolderClick(parentJobName)
        }
        resolve()
      }
      this.setState(updateFolderJobListState, afterSetState)
    })
  }

  hasParentInJobPath = (path, parent = '') => {
    /*
    Jenkins does not allow '/' in the file names
    so assuming parent(folder)/child(file) would be
    path strucure
    */
    if (path) {
      return path.includes('/' + parent)
    }
  }

  getParentJobName = path => {
    if (path) {
      const jobParts = path.split('/')
      if (this.hasParentInJobPath(path)) {
        return jobParts[0]
      }
    }
  }

  getChildJobName = (path, parent = '') => {
    if (path) {
      const index = path.indexOf(parent + '/')
      if (~index) {
        return path.substring(index + parent.length + 1) // Skip the slash
      }
    }

    return ''
  }

  renderJobList = () => {
    const jobList = this.props.jobList
    return (
      <Dropdown.Menu bsRole="menu" className={`${css.artifactJobList} __jobMenu`}>
        {jobList.map(job => {
          const isFolder = job.folder
          const jobName = job.jobName
          const className = isFolder ? css.Folder : css.File
          const selectedJobClass = this.state.selectedJob === jobName ? css.selectedFile : ''
          return (
            <MenuItem
              className={`${className} ${selectedJobClass} __menuItem`}
              onClick={() => {
                this.updateJobName(isFolder, jobName)
              }}
              key={jobName}
              data-name={jobName}
            >
              {isFolder && this.renderFolderUI(jobName)}
              {!isFolder && <span>{jobName} </span>}
            </MenuItem>
          )
        })}
      </Dropdown.Menu>
    )
  }

  updateJobName = (isFolder, jobName) => {
    if (!isFolder) {
      this.setState({ selectedJob: jobName })
      this.props.modifyJobName(jobName)
      // this.fromFolderChild = false
    } else {
      this.onFolderClick(jobName)
    }
  }

  renderFolderUI = jobName => {
    const folderJobList = this.state.folderJobList
    let expanded
    let className
    if (folderJobList.hasOwnProperty(jobName)) {
      expanded = folderJobList[jobName].expanded
      className = expanded ? 'expanded' : 'collapsed'
    } else {
      expanded = false
      className = ''
    }
    return (
      <div className={css.Folder} key={jobName}>
        <span className={`${className} FolderName`}>{jobName}</span>

        {expanded && <div className={css.FolderFileList}>{this.renderSecondLevelFiles(jobName)}</div>}
      </div>
    )
  }

  renderSecondLevelFiles = parentJobName => {
    const folderJobList = Utils.clone(this.state.folderJobList)
    const jobList = folderJobList[parentJobName]
    if (jobList.hasOwnProperty('jobs')) {
      const secondLevelJobs = jobList['jobs']
      if (secondLevelJobs && secondLevelJobs.length > 0) {
        return this.getSecondLeveFileTemplate(secondLevelJobs, parentJobName)
      } else {
        return <div className={css.noJobsTxt}>No Jobs Available</div>
      }
    } else {
      return <div>Loading...</div>
    }
  }

  getSecondLeveFileTemplate = (jobs, parentJobName) => {
    return (
      <ul className={css.FileList}>
        {jobs.map(job => {
          const isFolder = job.folder
          const childJob = job['jobName']
          const secondLevelJobName = childJob
          return (
            <li className={css.File} key={secondLevelJobName}>
              <div onClick={this.onClickOfSecondLevelFile.bind(this, parentJobName, childJob)}>
                {!isFolder && this.renderSecondLevelFileNames(childJob, parentJobName)}
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  onClickOfSecondLevelFile = (parentJobName, childJob) => {
    // const secondLevelJobName = parentJobName + '/' + childJob

    const secondLevelJobName = childJob
    this.fromFolderChild = true
    this.fromFolderClick = false
    this.setState({ selectedJob: secondLevelJobName })
    this.props.modifyJobName(childJob, parentJobName)
  }

  renderSecondLevelFileNames = (jobName, parentJobName) => {
    const filePath = jobName
    const selectedClass = filePath === this.props.jobName ? css.selected : ''
    return (
      <div className={css.nestedFileList}>
        <span className={css.fileSeparator} />&nbsp;
        <span className={`${css.secondLevelFileName} ${selectedClass}`}>{this.getChildJobName(jobName)}</span>
      </div>
    )
  }

  updateFolderJobList = (jobName, jobsList) => {
    const folderJobList = Utils.clone(this.state.folderJobList)
    if (folderJobList.hasOwnProperty(jobName)) {
      folderJobList[jobName] = {}
    }
    folderJobList[jobName].jobs = jobsList
    const filteredFiles = this.filterFiles(jobsList, jobName)
    if (filteredFiles && filteredFiles.length > 0) {
      this.props.modifyJobNameEnum(filteredFiles)
    }
    folderJobList[jobName].expanded = true
    this.fromFolderChild = false
    this.setState({ folderJobList })
  }

  filterFiles = (jobList, parentJobName) => {
    return Object.values(jobList).map(job => {
      if (!job.folder) {
        return `${job.jobName}`
      }
    })
  }

  onFolderClick = jobName => {
    // clicked folder is not expanded -> expand it and open it

    if (!this.fromFolderChild) {
      this.fromFolderClick = true
      const folderJobList = Utils.clone(this.state.folderJobList)
      if (folderJobList.hasOwnProperty(jobName)) {
        if (!folderJobList[jobName].expanded) {
          this.collapseOtherFolders(folderJobList, jobName)
          folderJobList[jobName].expanded = true
          this.fetchJenkinJobsForParentJob(jobName)
        } else {
          folderJobList[jobName].expanded = false
        }
      }

      this.setState({ folderJobList })
    }
  }

  collapseOtherFolders = (folderJobList, jobName) => {
    if (folderJobList) {
      for (const jobObj in folderJobList) {
        if (folderJobList[jobObj].expanded) {
          folderJobList[jobObj].expanded = false
        }
      }
    }
  }

  fetchJenkinJobsForParentJob = parentJobName => {
    const url = apis.getJenkinsBuildJobsEndPoint(this.props.appIdFromUrl, this.props.settingUuId, parentJobName)
    apis.service
      .list(url)
      .then(res => {
        if (res.resource) {
          this.updateFolderJobList(parentJobName, res.resource)
        } else {
          // eslint-disable-next-line no-undef
          log('No job names available')
        }
      })
      .catch(error => {
        throw error
      })
  }

  dropdownToggle = newValue => {
    if (this.fromFolderClick) {
      this.setState({ open: true })
      this.fromFolderClick = false
    } else {
      const boolValue = Utils.clone(this.state.open)
      this.setState({ open: !boolValue })
    }
    this.fromFolderChild = false
  }

  renderDeleteIcon = () => {
    const selectedJobText = Utils.clone(this.state.selectedJob)
    if (selectedJobText !== placeHolder) {
      return (
        <span className={css.clearContent}>
          <i
            className="icons8-delete"
            onClick={event => {
              event.stopPropagation()
              this.clearSelection.call(this)
            }}
          >
            {' '}
          </i>
        </span>
      )
    }
  }

  clearSelection = () => {
    // const selectedJobText = Utils.clone(this.state.selectedJob)
    this.setState({ selectedJob: placeHolder })
    this.fromFolderChild = false
  }

  render () {
    const selectedJobCls = this.state.selectedJob === placeHolder ? css.initialText : css.selectedJobText

    return (
      <div className={css.main} id="jenkins-job-component">
        {/** TODO: Rewrite to use a proper select */}
        <Dropdown
          vertical
          block
          open={this.state.open}
          onToggle={val => this.dropdownToggle(val)}
          id="artifact-job-selection"
          data-name="jenkin-jobs-dropdown"
        >
          <Dropdown.Toggle block className={css.dropDownToggle}>
            <span className={selectedJobCls}>{this.props.isLoading ? 'Loading...' : this.state.selectedJob}</span>
            {this.renderDeleteIcon()}
          </Dropdown.Toggle>
          {this.renderJobList()}
        </Dropdown>
      </div>
    )
  }
}

export default ArtifactJobSelection



// WEBPACK FOOTER //
// ../src/components/ArtifactJobSelection/ArtifactJobSelection.js