import Utils from './Utils'
import FormUtils from './FormUtils'

export default class TemplateUtils {
  /* Templatization common methods*/

  static setTemplatization = (
    formData,
    schema,
    uiSchema,
    workflowObj,
    dependentData,
    customTemplatizeObj,
    defaultTitles = []
  ) => {
    TemplateUtils.addWorkflowVariablesToSchema(schema, workflowObj)
    TemplateUtils.addTemplateFieldsToSchema(schema, formData)
    TemplateUtils.setTemplateFieldValue(schema, dependentData.dependentFormData, defaultTitles)
    if (dependentData.setDependency) {
      TemplateUtils.setDependencyForFieldsOnSchema(schema, dependentData.dependencyMap)
    }
    if (customTemplatizeObj.setTemplatizeOnFields) {
      TemplateUtils.addNoTemplatizeOptionToProperties(schema, customTemplatizeObj.templateFields)
    }
  }
  /*
  Filling userVarialbe for each field on the schema
  could not find a better way to as accessing reference to uservarialbes
  is difficult on customefieldtemplate
 */
  static addWorkflowVariablesToSchema = (schema, workflowObj) => {
    const schemaProperties = schema.properties
    const catalogs = workflowObj.metadataObj.entityTypeCatalogs
    const userVariables = workflowObj.userVariables
    Object.keys(schemaProperties).map(property => {
      const entityType = TemplateUtils.getEntityTypeForFieldName(property, catalogs)
      let filteredUserVariable = []
      if (userVariables.length > 0) {
        filteredUserVariable = userVariables.filter(userVariable => userVariable.metadata.entityType === entityType)
      } else {
        filteredUserVariable = []
      }
      schemaProperties[property]['userVariables'] = filteredUserVariable
      if (workflowObj.workflowType) {
        schemaProperties[property]['workflowType'] = workflowObj.workflowType
      }
    })
  }

  // Set default templateField default value for dependent fieldNames(for dropdowns)
  static setDependencyForFieldsOnSchema (schema, dependencyMap) {
    const schemaProperties = schema.properties
    Object.keys(dependencyMap).map(property => {
      const dependentProperty = dependencyMap[property]
      if (schemaProperties[property]) {
        schemaProperties[property]['dependentField'] = dependentProperty
      }
    })
  }
  // Set default templateField default values for non-dropdowns
  static setDefaultTemplateFieldValue (schema, stateName) {
    const schemaProperties = schema.properties
    Object.keys(schemaProperties).map(property => {
      const schemaProperty = schemaProperties[property]
      if (schemaProperty) {
        const title = schemaProperty['title']
        schemaProperty['defaultTemplateFieldValue'] = `${stateName}_${title}`
      }
    })
  }
  /* Default Template values for dependent dropdwons */
  static setTemplateFieldValue (schema, dependentFormData, defaultTitles) {
    const schemaProperties = schema.properties
    Object.keys(schemaProperties).map(property => {
      const schemaProperty = schemaProperties[property]
      if (schemaProperty) {
        const title = schemaProperty['title']
        if (dependentFormData && dependentFormData[property]) {
          if (defaultTitles[property]) {
            schemaProperty['defaultTemplateFieldValue'] = `${defaultTitles[property]}_${dependentFormData[property]}`
          } else {
            schemaProperty['defaultTemplateFieldValue'] = `${title}_${dependentFormData[property]}`
          }
        } else {
          schemaProperty['defaultTemplateFieldValue'] = `${title}`
        }
      }
    })
  }

  // modifying formdata payload to include templateExpressions
  static transformDataForTemplatization (formData, schema, metadataObj) {
    // const schema = Utils.clone(this.state.schema)
    const responseObj = Utils.findNested(schema, 'templatizedField', {})
    formData.templateExpressions = []
    for (const templateItem of responseObj) {
      if (templateItem.expression) {
        // const obj = `${templateItem.name}:${templateItem.value}`
        delete templateItem.edit
        templateItem['metadata'] = {}
        if (metadataObj) {
          const entityType = FormUtils.getEntityTypeForFieldName(templateItem.fieldName, metadataObj.entityTypeCatalogs)
          if (metadataObj.entityTypeCatalogs && entityType) {
            templateItem['metadata']['entityType'] = entityType
          }
          if (metadataObj.artifactType) {
            templateItem['metadata']['artifactType'] = metadataObj.artifactType
          }
          if (metadataObj.dependencyMap) {
            const relatedFieldExpression = FormUtils.addRelatedFieldToTemplateExpression(
              templateItem.fieldName,
              metadataObj.dependencyMap,
              responseObj
            )
            templateItem['metadata']['relatedField'] = relatedFieldExpression ? relatedFieldExpression : ''
          }
        }
        formData.templateExpressions.push(templateItem)
        // Utils.fillFieldsWithTemplateValuesIfEmpty(formData, templateItem)
      }
    }
  }
  static addRelatedFieldToTemplateExpression (fieldName, dependencyMap, responseObj) {
    const relatedField = dependencyMap[fieldName]
    if (relatedField) {
      for (const templateItem of responseObj) {
        if (templateItem.fieldName === relatedField && templateItem.expression) {
          return templateItem.expression
        }
      }
    }
  }
  // get entity type name for a  field
  static getEntityTypeForFieldName (fieldName, entityCatalogs) {
    if (entityCatalogs && fieldName) {
      const entityObj = entityCatalogs.find(entity => entity.name === fieldName)
      return entityObj ? entityObj.value : null
    }
  }
  static fillFieldsWithTemplateValuesIfEmpty (formData, templateExpression) {
    const property = templateExpression.fieldName
    if (!formData[property] && templateExpression.expression) {
      formData[property] = templateExpression.expression
    }
  }
  /*
   customizing schema to have templateExpressions as part of the schema
   this expression will be used to change the values
  */
  static addTemplateFieldsToSchema (schema, formData) {
    const templateExpressionObj = TemplateUtils.modifyFormDataTemplateExpressions(formData)
    if (schema) {
      const schemaProperties = schema.properties
      Object.keys(schemaProperties).map(prop => {
        const type = schemaProperties[prop].type
        if (type !== 'array') {
          if (!schemaProperties[prop]['templatizedField']) {
            schemaProperties[prop].templatizedField = {}
          }
          schemaProperties[prop].templatizedField = {
            fieldName: prop,
            expression: templateExpressionObj[prop],
            edit: true
          }

          /* TemplateUtils.setMetaData(
            metadata,
            schemaProperties[prop].templatizedField
          )*/
        } else {
          schemaProperties[prop]['templatize'] = false
          TemplateUtils.makeArrayItemsAsToNotTemplatize(schemaProperties[prop])
        }
      })
    }
  }
  /*
Adding noTemplatize option for ArrayItems on the schema
will be used in 'CustomFieldTemplate' to not to showFields
customize option for the fields
*/
  static makeArrayItemsAsToNotTemplatize (property) {
    const childProperties = property.items.properties
    Object.keys(childProperties).map(prop => {
      childProperties[prop]['templatize'] = false
    })
  }
  /*
Adding noTemplatize option for properties on the schema
will be used in 'CustomFieldTemplate' to not to showFields
customize option for the fields
*/
  static addNoTemplatizeOptionToProperties (schema, templatizedFields) {
    const properties = schema.properties
    Object.keys(properties).map(property => {
      const item = properties[property]
      if (item.type === 'object') {
        TemplateUtils.addNoTemplatizeOptionToProperties(item, templatizedFields)
      }
      item.templatize = templatizedFields.indexOf(property) > -1 ? true : false
    })
  }

  static modifyFormDataTemplateExpressions (formData) {
    const templateExpressionObj = {}
    if (formData.templateExpressions) {
      for (const expressionItem of formData.templateExpressions) {
        const fieldName = expressionItem.fieldName
        const value = expressionItem.expression
        templateExpressionObj[fieldName] = value
      }
    }
    return templateExpressionObj
  }
  static getDependentFormData = (schema, formData) => {
    if (formData.serviceId) {
      const enmIdx = schema.properties['serviceId'].enum.findIndex(optn => optn === formData.serviceId)
      const originalValue = schema.properties['serviceId'].enumNames[enmIdx]
      return `Service_${originalValue}`
    }
  }
  /*
  Validation for Template templateExpressions
  when there is a dependency`
 */
  static validateFormDataForTemplateWorkflow = (templateExpressions, errors, dependencyMap, schema) => {
    const schemaProperties = schema.properties
    if (templateExpressions) {
      for (const templateItem of templateExpressions) {
        const fieldName = templateItem.fieldName
        const dependentField = dependencyMap[fieldName]
        const ifDependentFieldExists = FormUtils.checkIfDependentFieldExists(dependentField, templateExpressions)
        if (!ifDependentFieldExists && dependentField) {
          const fieldTitle = schemaProperties[fieldName]['title']
          const dependentTitle = schemaProperties[dependentField]['title']
          const errorMsg = `Please Templatize ${dependentTitle} as ${fieldTitle} is Templatized`
          errors[dependentField].addError(errorMsg)
        } else {
          delete errors[dependentField]
        }
      }
    }
    return errors
  }
  /*
    To check if a property has a dependency
  */
  static checkIfDependentFieldExists = (dependentField, templateExpressions) => {
    for (const templateItem of templateExpressions) {
      const fieldName = templateItem.fieldName
      if (fieldName === dependentField) {
        return true
      }
    }
    return false
  }
  /*
    DefaultTemplateFieldValue -> By Default would be Environment
    if exists we modify as environment2
    same for service/serviceinfra
   */
  static checkAndModifyDuplicateUserVariable = (schema, userVariables, entityTypeCatalogs) => {
    const schemaProperties = schema.properties
    Object.keys(schemaProperties).map(property => {
      const schemaProperty = schemaProperties[property]
      if (schemaProperty) {
        const defaultTemplateFieldValue = schemaProperty.defaultTemplateFieldValue

        const entityType = TemplateUtils.getEntityTypeForFieldName(property, entityTypeCatalogs)

        const userVariablesFilteredByEntity = TemplateUtils.findAllUserVariablesByEntityType(userVariables, entityType)

        if (userVariablesFilteredByEntity.length > 0) {
          const duplicateUserVariable = TemplateUtils.findDuplicateUserVariable(
            userVariables,
            defaultTemplateFieldValue
          )
          if (duplicateUserVariable) {
            const numberFromExpression = TemplateUtils.getNumberFromTemplateExpression(duplicateUserVariable.name)
            if (numberFromExpression > 0) {
              schemaProperty.defaultTemplateFieldValue = `${defaultTemplateFieldValue}${numberFromExpression + 1}`
            }
          }
        }
      }
    })
  }
  /* End Of Templatization methods */

  /* Filter Workflow Variables by entityType */
  static filterWorkflowVariablesByEntityType = (workflowVariables, entityType) => {
    for (const variable of workflowVariables) {
      if (variable.metadata.entityType === entityType) {
        return variable
      }
    }
  }

  static findAllUserVariablesByEntityType = (userVariables, entityType) => {
    if (userVariables) {
      return userVariables.filter(userVariable => userVariable.metadata.entityType === entityType)
    }
  }
  /*
  This is to strip off special charecters and extract the value
  if expression is ${123} => we need 123
*/
  static stripOffSpecialCharecters = expression => {
    if (expression) {
      return expression.replace(/[^\w\s]/gi, '')
    }
  }
  /*
  To Avoid duplicate expressions
  default template field value -> will be service/env/serviceinfra
  if they exist we should add service2 and if service2 exists it should be
  service3
 */
  static getNumberFromTemplateExpression = expression => {
    const numbers = expression.match(/\d/g)
    if (numbers) {
      return Number(numbers.join(''))
    }
    return 1
  }
  static findDuplicateUserVariable = (userVariables, name) => {
    const expressionValue = Utils.stripOffSpecialCharecters(name)
    if (userVariables && name) {
      return userVariables.find(userVariable => userVariable.name === expressionValue)
    }
  }
  /* get template expressions from phases */
  static getTemplateExpressionFromPhases = (phases, entityType) => {
    const templateEntities = []
    for (const phase of phases) {
      const templateExpressions = phase.templateExpressions
      if (templateExpressions) {
        const templateEntity = Utils.filterWorkflowVariablesByEntityType(templateExpressions, entityType)
        if (templateEntity) {
          templateEntities.push(templateEntity)
        }
      }
    }
    return templateEntities
  }

  /* Get Envnames for phases with templateexpressions */
  static getEnvironmentName = (workflow, env) => {
    let envName
    if (workflow) {
      if (workflow.templateExpressions) {
        const templateExpressions = workflow.templateExpressions
        const envVariable = Utils.filterWorkflowVariablesByEntityType(
          templateExpressions,
          Utils.entityTypes.environment
        )
        envName = envVariable ? envVariable.expression : ''
      } else {
        envName = env ? env.name : ''
      }
    }
    return envName
  }

  /* Get ServiceNames for workflow with template expressions */
  static getServiceNames = workflow => {
    let serviceNames
    if (workflow) {
      const phases = workflow.orchestrationWorkflow ? workflow.orchestrationWorkflow.workflowPhases : []
      if (phases && phases.length > 0) {
        const templateExpressions = Utils.getTemplateExpressionFromPhases(phases, Utils.entityTypes.service)
        if (templateExpressions.length > 0) {
          serviceNames = templateExpressions.map(item => item.expression).join(', ')
        } else {
          serviceNames = workflow.services.map(svc => svc.name).join(', ')
        }
      } else {
        serviceNames = workflow.services.map(svc => svc.name).join(', ')
      }
    }
    return serviceNames
  }

  /* Template Expression entity types */
  static entityTypes = {
    environment: 'ENVIRONMENT',
    service: 'SERVICE',
    infraMapping: 'INFRASTRUCTURE_MAPPING'
  }
  static entityTypeTitles = {
    ENVIRONMENT: 'Environment',
    SERVICE: 'Service',
    INFRASTRUCTURE_MAPPING: 'Service Infrastructure'
  }

  static sleep (ms) {
    new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }
  // Filtering workflowhases by serviceid this will be used at multiple places
  static filterWorkflowPhasesByServiceId = (selectedWorkflow, serviceId) => {
    const workflowPhases = selectedWorkflow ? selectedWorkflow.orchestrationWorkflow.workflowPhases : []
    const filteredPhaseByServiceId = workflowPhases.find(phase => phase.serviceId === serviceId)
    if (filteredPhaseByServiceId) {
      return filteredPhaseByServiceId
    }
  }

  static filterWorkflowVariables = (workflowVariables, searchValue, filterBy, metaDataProp = null) => {
    if (filterBy === 'metadata' && metaDataProp) {
      return workflowVariables.filter(variable => variable.metadata[metaDataProp] === searchValue)
    } else {
      return workflowVariables.filter(variable => variable[filterBy] === searchValue)
    }
  }
}



// WEBPACK FOOTER //
// ../src/components/Utils/TemplateUtils.js