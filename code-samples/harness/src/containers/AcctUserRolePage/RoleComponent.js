import React from 'react'
import css from './AddUserModal.css'
import { Checkbox, Radio } from 'react-bootstrap'
import { MultiSelectDropdown, Utils } from 'components'

const appSpecificRolesEnum = {
  'Application Administrator': 0,
  'Production Support': 1,
  'Non-production Support': 2
}

export default class RoleComponent extends React.Component {
  state = { roles: [] }
  data = {}

  /* Filling state object with roles.For each role we indicate
    if it is application specific role or not
    and maintains if this role is checked or not
   */
  componentWillMount () {
    const roles = Utils.getJsonValue(this.props.roleProps, 'options.enumOptions') || []
    this.data = this.props.formData
    if (roles !== undefined) {
      this.updateState(roles)
    }
  }

  componentWillReceiveProps (newProps) {
    this.data = newProps.formData
  }
  getRoleTypeIndex (role) {
    const roleTypes = this.data.roleTypes
    return roleTypes.findIndex(type => type === role)
  }
  /* Setting up roles on the state- to indicate
    whether a role is checked/it has multiseelect/ is specific to an application
    will use the same object to edit/create user and roles
   */
  updateState (roles) {
    const rolesArr = []
    {
      roles &&
        roles.map(role => {
          const savedIdx = this.getRoleTypeIndex(role.label)
          const roleObj = {}
          roleObj.role = role.label
          const isAppSpecific = this.isAppSpecificRole(role.label)
          roleObj.isAppSpecific = isAppSpecific
          roleObj.disabled = isAppSpecific !== undefined ? true : false
          roleObj.showRadioBox = savedIdx > -1 ? css.show : css.hide
          roleObj.isChecked = savedIdx > -1 ? true : false
          roleObj.isSpecific = isAppSpecific === undefined ? false : this.isSpecificAppRole(role.label)
          roleObj.showMultiSelect =
            roleObj.isAppSpecific !== undefined && roleObj.isSpecific === true && savedIdx > -1 ? css.show : css.hide
          rolesArr.push(roleObj)
          this.setState({ roles: rolesArr })
        })
    }
  }
  /*
  Determines if the current role is account admisitrator or
   application speficic role(any one from the appSpecific enum)
  */
  isAppSpecificRole (role) {
    return appSpecificRolesEnum[role]
  }

  /* Determines if all/specific applications radio button is clicked */
  isSpecificAppRole (roleName) {
    const formData = Utils.clone(this.props.formData)
    const roleObject = formData.roles.filter(role => role.name === roleName)
    const allAppsIdx = roleObject.findIndex(object => object.allApps === true)
    return allAppsIdx === -1 && roleObject.length > 0 ? true : false
  }

  render () {
    const roleProps = this.props.roleProps
    const roles = Utils.getJsonValue(this.props.roleProps, 'options.enumOptions') || []
    return (
      <div className={css.roleComponent}>
        {roles &&
          roles.map(role => {
            const roleIndex = this.getRoleObjectIndex(role.label)
            const uiRoles = this.state.roles
            const roleObj = uiRoles[roleIndex]
            const isAppSpecific = roleObj.isAppSpecific
            const appData = this.getApplications(role.label)
            return (
              <div>
                <Checkbox
                  className={css.roleCheckBox}
                  data-name={role.label}
                  checked={roleObj.isChecked}
                  onChange={event => this.onRoleUpdate(event, role.label)}
                  disabled={roleObj.disabled}
                >
                  {role.label}
                </Checkbox>

                {isAppSpecific !== undefined && this.getAppSpecificUI(role.label)}

                {isAppSpecific !== undefined && this.getMultiSelect(role.label, roleProps, appData)}
              </div>
            )
          })}
      </div>
    )
  }
  /* grouping applications for a role
  as role: apps:[]
  */
  getApplications (role) {
    const roleMapping = this.props.roleMapping
    const rolesObject = roleMapping.filter(mapping => mapping.name === role)
    return rolesObject.reduce(function callback (result, key, index) {
      if (rolesObject[index].allApps === false) {
        result.push({ label: rolesObject[index].appName, value: rolesObject[index].appId })
      }
      return result
    }, [])
  }

  /*
    on change of checkbox event
    when checked - filter role and update formData applications ,roletypes and role
    if it is application admisitrator or any application with all-radio box clicked
    update roles/roletypes and applications(global object)
    for others just update roleTypes and applications
    on unchecking - delete all applications for the role,remove from roleTy
  */
  onRoleUpdate (event, role) {
    const formData = Utils.clone(this.data)
    if (!formData.hasOwnProperty('applications')) {
      formData.applications = []
    }
    const isChecked = event.target.checked
    const roleIndex = this.getRoleObjectIndex(role)
    const rolesObj = this.state.roles
    const isAppSpecific = rolesObj[roleIndex].isAppSpecific
    const isSpecific = rolesObj[roleIndex].isSpecific
    rolesObj[roleIndex].showMultiSelect = isChecked && isSpecific ? css.show : css.hide
    rolesObj[roleIndex].showRadioBox = isChecked ? css.show : css.hide
    rolesObj[roleIndex].isChecked = isChecked
    if (isChecked) {
      if (isAppSpecific === undefined || !isSpecific) {
        const filteredRoleObj = this.filterRoles(rolesObj[roleIndex])
        formData.applications.push(this.addApplication(role, [filteredRoleObj[0].appId]))
        this.updateFormData(formData, filteredRoleObj)
        // this.data = formData
      } else {
        formData.roleTypes.push(role)
        formData.applications.push(this.addApplication(role, []))
        this.data = formData
      }
    } else {
      this.deleteRole(role)
      rolesObj[roleIndex].showMultiSelect = css.hide
      rolesObj[roleIndex].showRadioBox = css.hide
      rolesObj[roleIndex].isSpecific = false
    }
    this.props.setFormData(this.data)
    this.setState({ roles: rolesObj })
  }

  updateFormData = (newFormData, filteredRoleObj) => {
    const formData = Utils.clone(this.data)
    const mappingObj = filteredRoleObj[0]
    formData.roles.push(mappingObj)
    formData.roleTypes = this.getUniqueRoleTypes(formData.roles)
    formData.applications = newFormData.applications
    this.data = formData
  }
  /*
   each role for a different application has a different uuid
   to get the unique roletype names
   */
  getUniqueRoleTypes (roles) {
    const roleTypesSet = new Set(roles.map(role => role.name))
    return Array.from(roleTypesSet)
  }
  /*
    If a role is unchecked - remove all applications
    and remove all uuid's of this rolename on the formData.roles Object
   */
  deleteRole (role) {
    const formData = Utils.clone(this.data)
    const savedAppsIdx = formData.applications.findIndex(application => application.role === role)
    const savedRoles = formData.roles.filter(type => type.name === role)
    const roleTypeIdx = formData.roleTypes.findIndex(roleType => roleType === role)
    if (savedAppsIdx > -1) {
      formData.applications.splice(savedAppsIdx, 1)
    }
    if (roleTypeIdx > -1) {
      formData.roleTypes.splice(roleTypeIdx, 1)
    }
    this.data = formData
    if (savedRoles.length > 0) {
      const savedIndexes = this.filterRolesByName(role)
      this.multiSplice(savedIndexes)
    }
  }

  addApplication (role, apps) {
    const roleObj = {}
    roleObj.role = role
    roleObj.apps = apps
    return roleObj
  }
  /*
      For account admin- select role object with the same name
      for all other roles
          1 .If all is checked-> filter out the role with allapps=true and has same name
          2. For specific->filter out the role with same name and has same appid
   */
  filterRoles (roleObj, appId = '') {
    const roleMapping = this.props.roleMapping
    if (roleObj.isAppSpecific === undefined) {
      return roleMapping.filter(role => role.name === roleObj.role)
    } else if (!roleObj.isSpecific) {
      return roleMapping.filter(role => role.name === roleObj.role && role.allApps === true)
    } else {
      return roleMapping.filter(role => role.name === roleObj.role && role.allApps === false)
    }
  }

  /*
    When all is selected => remove all specifc apps mapping
    remove all roles with allapps =false on roles object and push global app uuid to role object
    when specific is selected-> remove allapps =true role roleObject
    and push all roles with allapps=false on role object
   */
  onRadioChange (event, type, role) {
    const formData = Utils.clone(this.data)
    const roleIndex = this.getRoleObjectIndex(role)
    const rolesObj = this.state.roles
    const isChecked = event.target.checked
    const multiSelectClsName = isChecked && type === 'Specific' ? css.show : css.hide
    const savedAppIdx = formData.hasOwnProperty('applications')
      ? formData.applications.findIndex(application => application.role === role)
      : -1
    if (isChecked) {
      if (type === 'All') {
        rolesObj[roleIndex].isSpecific = false
        rolesObj[roleIndex].showMultiSelect = multiSelectClsName
        const filteredRoleObj = this.filterRoles(rolesObj[roleIndex])
        this.removeSpecificAppsMapping(role)
        this.updateApplications(role, filteredRoleObj[0].appId, savedAppIdx)
        this.updateFormData(this.data, filteredRoleObj)
      } else if (type === 'Specific') {
        rolesObj[roleIndex].isSpecific = true
        rolesObj[roleIndex].showMultiSelect = multiSelectClsName
        this.removeAllAppsMapping(role)
      }
      this.props.setFormData(this.data)
      this.setState({ roles: rolesObj })
    }
  }
  /* Get all indices of the roleobject with has the same rolename */
  filterRolesByName (role) {
    const formData = this.data
    const result = formData.roles.reduce(function callback (res, key, index) {
      if (key.name === role) {
        res.push(index)
      }
      return res
    }, [])
    return result
  }
  /* Finds all indices of the role which has allapps==false */
  findAllSpecificAppsIndexes (role) {
    const formData = this.data
    const result = formData.roles.reduce(function callback (res, key, index) {
      if (key.name === role && key.allApps === false) {
        res.push(index)
      }
      return res
    }, [])
    return result
  }
  /* remove roleuuid with allapps===true */
  removeAllAppsMapping (role) {
    const formData = Utils.clone(this.data)
    const allAppsIdx = formData.roles.findIndex(
      selectedRole => selectedRole.name === role && selectedRole.allApps === true
    )
    const allAppObj = formData.roles[allAppsIdx]
    if (allAppsIdx > -1) {
      formData.roles.splice(allAppsIdx, 1)
      const appIdx = formData.applications.findIndex(application => application.role === role)
      const globalAppIdx = formData.applications[appIdx].apps.findIndex(app => app === allAppObj.appId)
      formData.applications[appIdx].apps.splice(globalAppIdx, 1)
      this.data = formData
    }
  }
  /*
    slicing multiple indices - js slice logic is modified a bit
    as once sliced, further indexes would be changed and does not let you to slice more elements

   */
  multiSplice (indexes, appIdx) {
    const formData = Utils.clone(this.data)
    indexes.sort(function callback (a, b) {
      return a - b
    })
    for (let i = 0; i < indexes.length; i++) {
      const index = indexes[i] - i
      formData.roles.splice(index, 1)
    }
    if (appIdx > -1) {
      formData.applications[appIdx].apps = []
    }
    this.data = formData
  }
  /* removes all specific app -> all uuid which has the same rolename and allapps==false */
  removeSpecificAppsMapping (role) {
    const formData = Utils.clone(this.data)
    const specificAppIndices = this.findAllSpecificAppsIndexes(role)
    const appIdx = formData.applications.findIndex(application => application.role === role)
    if (specificAppIndices.length > 0) {
      this.multiSplice(specificAppIndices, appIdx)
    }
  }

  updateApplications (role, apps, savedAppIdx) {
    const formData = Utils.clone(this.data)
    if (!formData.hasOwnProperty('applications')) {
      formData.applications = []
    }
    if (savedAppIdx > -1) {
      formData.applications[savedAppIdx].apps.push(apps)
    } else {
      formData.applications.push(this.addApplication(role, []))
    }
    this.data = formData
    // this.props.reset(formData)
  }

  getAppSpecificUI (role, isChecked) {
    const roleIndex = this.getRoleObjectIndex(role)
    const rolesObj = this.state.roles
    const isSpecific = rolesObj[roleIndex].isSpecific
    const groupName = 'groupOptions' + '_' + role
    return (
      <div className={`${css.roleRadioGroup} ${this.state.roles[roleIndex].showRadioBox} `}>
        <Radio
          name={groupName}
          className={css.radioOption}
          checked={!isSpecific}
          onChange={event => this.onRadioChange(event, 'All', role)}
        >
          All
        </Radio>
        <Radio
          name={groupName}
          className={css.radioOption}
          checked={isSpecific}
          onChange={event => this.onRadioChange(event, 'Specific', role)}
        >
          Specific
        </Radio>
      </div>
    )
  }
  /* if there is any app value selected use that else multiselect value is empty */
  getMultiSelect (role, roleProps, appData) {
    const roleIndex = this.getRoleObjectIndex(role)
    const formData = Utils.clone(this.data)

    const selectedRoleObj =
      formData.applications !== undefined && formData.applications.find(type => type.role === role)

    this.data = formData
    const apps = selectedRoleObj !== undefined && selectedRoleObj.apps
    return (
      <div className={this.state.roles[roleIndex].showMultiSelect}>
        <MultiSelectDropdown
          description="Select Applications"
          data={appData}
          {...roleProps}
          ref="appList"
          value={apps}
          onChange={val => {
            this.updateAppList(role, val, roleProps)
            this.props.setFormData(this.data)
          }}
        />
      </div>
    )
  }
  /* When existing apps list does not match with the new appList
    If it is more -> adds new application
    or deletes application
    If all apps are removed -> just delete all exisitng applications
   */
  updateAppList (role, value, roleProps) {
    const formData = Utils.clone(this.data)
    const selectedRoles = formData.roles.filter(selectedRole => selectedRole.name === role)
    const selectedAppIds = selectedRoles.map(selectedRole => selectedRole.appId)

    if (value.length === 0 && selectedAppIds.length >= 0) {
      this.deleteApplications(selectedAppIds, role, roleProps)
    } else {
      const apps = value.split(',')

      if (apps.length !== selectedAppIds.length) {
        const newAppList = this.getNewAppList(apps, selectedAppIds)
        const deleteAppList = this.getDeleteAppList(apps, selectedAppIds)
        if (newAppList.length > 0) {
          this.addNewApplications(newAppList, role, roleProps)
        }
        if (deleteAppList.length >= 0) {
          this.deleteApplications(deleteAppList, role, roleProps)
        }
      }
    }
  }
  /* When a new application is added
    finds the correspoinding uuid and pushes to roles and updates application object
   */
  addNewApplications (appList, role, roleProps) {
    // this.props.multiSelectData = []
    const formData = Utils.clone(this.data)
    if (!formData.hasOwnProperty('roles')) {
      formData.roles = []
    }
    if (!formData.hasOwnProperty('applications')) {
      formData.applications = []
    }
    const roleMapping = this.props.roleMapping
    for (const id of appList) {
      const mappingObj = roleMapping.find(mapping => mapping.appId === id && mapping.name === role)
      formData.roles.push(mappingObj)
      const savedAppIdx = formData.applications.findIndex(application => application.role === role)
      const appObj = {}
      appObj.value = mappingObj.appId
      appObj.label = mappingObj.appName

      formData.roleTypes.push(mappingObj.name)
      formData.applications[savedAppIdx].apps.push(appObj)
    }
    this.data = formData
    // this.props.setFormData(formData)
  }
  addAppToFormData (mappingObj, appObj) {
    const resObj = {}
    resObj.role = mappingObj.name
    resObj.apps = []
    resObj.apps.push(appObj)
    return resObj
  }

  deleteApplications (appList, role, roleProps) {
    const formData = Utils.clone(this.data)
    for (const id of appList) {
      const idx = formData.roles.findIndex(selectedRole => selectedRole.name === role && selectedRole.appId === id)
      const obj = formData.roles[idx]
      formData.roles.splice(idx, 1)
      const savedAppIdx = formData.applications.findIndex(application => application.role === role)
      if (savedAppIdx > -1) {
        const appIdx = formData.applications[savedAppIdx].apps.findIndex(app => app.label === obj.appName)
        formData.applications[savedAppIdx].apps.splice(appIdx, 1)
      }
    }
    this.data = formData
    // this.props.setFormData(formData)
  }
  getNewAppList (appIds, selectedAppIds) {
    return appIds.filter(appId => selectedAppIds.indexOf(appId) === -1)
  }

  getDeleteAppList (appIds, selectedAppIds) {
    return selectedAppIds.filter(selectedAppId => appIds.indexOf(selectedAppId) === -1)
  }
  getRoleObjectIndex (role) {
    return this.state.roles.findIndex(item => item.role === role)
  }
}



// WEBPACK FOOTER //
// ../src/containers/AcctUserRolePage/RoleComponent.js