import Utils from './Utils'

export default class FormUtils {
  // clone function (keep references like: custom component functions, etc.) - https://goo.gl/XVHFX6
  static clone (obj) {
    let copy
    // Handle the 3 simple types, and null or undefined
    if (null === obj || 'object' !== typeof obj) {
      return obj
    }
    // Handle Date
    if (obj instanceof Date) {
      copy = new Date()
      copy.setTime(obj.getTime())
      return copy
    }
    // Handle Array
    if (obj instanceof Array) {
      copy = []
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.clone(obj[i])
      }
      return copy
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {}
      for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = this.clone(obj[attr])
        }
      }
      return copy
    }
    throw new Error('Unable to copy obj! Its type isn\'t supported.')
  }

  static setEnumAndNames (enumField, fromArray, idField = 'uuid', nameField = 'name') {
    if (enumField) {
      const arr = fromArray || []
      enumField.enum = arr.map(obj => obj[idField])
      enumField.enumNames = arr.map(obj => obj[nameField])
    }
  }

  static setCustomOptions (field, options) {
    if (field) {
      field['custom:options'] = options
    }
  }

  /*
   If the enum and enumNames is just an []
   we can use this utils mehtod
  */
  static fillEnumAndNamesWithSimpleArray (enumField, fromArray, keyArr, valueArr) {
    if (enumField) {
      const arr = fromArray || []
      const keys = keyArr || arr
      const values = valueArr || arr

      enumField['enum'] = [...keys]
      enumField['enumNames'] = [...values]
    }
  }

  static setEnumData (enumField, enumData) {
    enumField.data = enumData || []
  }

  static showFields (baseUiSchema, uiSchema, fieldNamesArr, showFlag = true) {
    for (const fieldName of fieldNamesArr) {
      if (showFlag) {
        const baseUiProp = Utils.findNested(baseUiSchema, fieldName)
        const uiProp = Utils.findNested(uiSchema, fieldName)
        if (baseUiProp.length > 0) {
          if (baseUiProp[0]['ui:widget'] === 'hidden') {
            // if it was hidden in baseUiSchema originally => to show it, delete it from uiSchema:
            delete uiProp[0]['ui:widget']
          } else {
            uiProp[0]['ui:widget'] = baseUiProp[0]['ui:widget'] // restore 'ui:widget' from baseUiSchema.
          }
          // if there is a Custom Widget for this field => set it:
          // if (baseUiSchema.widgets && baseUiSchema.widgets[fieldName]) {
          //   uiProp[0]['ui:widget'] = baseUiSchema.widgets[fieldName]
          // }
          if (baseUiProp[0]['custom:widget']) {
            uiProp[0]['ui:widget'] = baseUiProp[0]['custom:widget']
          }
        } else if (uiProp && uiProp[0]) {
          // no baseUiProp defined => just delete it from uiProp
          delete uiProp[0]['ui:widget']
        }
      } else {
        // Hide field
        const uiProp = Utils.findNested(uiSchema, fieldName)
        if (uiProp && uiProp[0]) {
          uiProp[0]['ui:widget'] = 'hidden'
        }
        if (!uiProp || uiProp.length === 0) {
          uiSchema[fieldName] = { 'ui:widget': 'hidden' } // if field does not exist in uiSchema => set it.
        }
      }
    }
  }

  static hideFields (baseUiSchema, uiSchema, fieldNamesArr) {
    // TODO: baseUISchema is not used in this case
    this.showFields(baseUiSchema, uiSchema, fieldNamesArr, false)
  }

  static setLoadingFields (baseUiSchema, uiSchema, fieldNamesArr, isLoading, loadingText = 'Loading...') {
    for (const fieldName of fieldNamesArr) {
      const baseUiProp = Utils.findNested(baseUiSchema, fieldName)
      const uiProp = Utils.findNested(uiSchema, fieldName)
      if (isLoading) {
        uiProp[0]['ui:placeholder'] = loadingText
      } else {
        // if isLoading false, restore to the original placeholder
        uiProp[0]['ui:placeholder'] = baseUiProp[0]['ui:placeholder']
      }
    }
  }

  static setRequired (formSchema, fieldNamesArr, flag) {
    if (!formSchema || !formSchema.required) {
      return
    }
    for (const fieldName of fieldNamesArr) {
      // first, just remove fieldName from formSchema.required array
      if (formSchema.required.indexOf(fieldName) >= 0) {
        const newArr = []
        for (const name of formSchema.required) {
          if (name === fieldName) {
            continue
          }
          newArr.push(name)
        }
        formSchema.required = newArr
      }
      // then set/unset
      if (flag) {
        formSchema.required.push(fieldName)
      } else {
        // do nothing (already removed from the 1st step)
      }
    }
  }

  // transform "data" from APIs to formData
  static toFormData = ({ data = {}, arrayToStringProps }) => {
    const _data = data ? Utils.clone(data) : {}

    // delete null properties because Form Field (like Dropdown) doesn't accept null as a valid value.
    const _deleteNullProps = function (obj) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] === null) {
            delete obj[key]
          } else if (typeof obj === 'object') {
            _deleteNullProps(obj[key])
          }
        }
      }
    }
    _deleteNullProps(_data)

    // convert array to comma separated string (for Multi-Select Dropdowns, etc.)
    const _convertArrayToString = function (obj, fieldName) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === fieldName && obj[key] && Array.isArray(obj[key])) {
            obj[key] = obj[key].join(',')
          } else if (typeof obj === 'object' && !Array.isArray(obj)) {
            _convertArrayToString(obj[key], fieldName)
          }
        }
      }
    }
    if (arrayToStringProps && arrayToStringProps.length > 0) {
      for (const prop of arrayToStringProps) {
        _convertArrayToString(_data, prop)
      }
    }
    return _data
  }

  static isFieldChanged = (ctx, formData, fieldName, subFormData) => {
    const lastValue =
      (subFormData ? subFormData[fieldName] : Utils.getJsonValue(ctx, 'state.formData.' + fieldName)) || ''
    const currentValue = formData[fieldName]
    return typeof currentValue !== 'undefined' && currentValue !== lastValue
  }

  /* Templatization common methods*/

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
    const templateExpressionObj = FormUtils.modifyFormDataTemplateExpressions(formData)
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
        } else {
          schemaProperties[prop]['templatize'] = false
          FormUtils.makeArrayItemsAsToNotTemplatize(schemaProperties[prop])
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
    const childProperties = Utils.getJsonValue(property, 'items.properties') || {}
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
        FormUtils.addNoTemplatizeOptionToProperties(item, templatizedFields)
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

        const entityType = FormUtils.getEntityTypeForFieldName(property, entityTypeCatalogs)

        const userVariablesFilteredByEntity = Utils.findAllUserVariablesByEntityType(userVariables, entityType)

        if (userVariablesFilteredByEntity.length > 0) {
          const duplicateUserVariable = Utils.findDuplicateUserVariable(userVariables, defaultTemplateFieldValue)
          if (duplicateUserVariable) {
            const numberFromExpression = Utils.getNumberFromTemplateExpression(duplicateUserVariable.name)
            if (numberFromExpression > 0) {
              schemaProperty.defaultTemplateFieldValue = `${defaultTemplateFieldValue}${numberFromExpression + 1}`
            }
          }
        }
      }
    })
  }
  /* End Of Templatization methods */

  static autoProcessChange = async (
    ctx,
    formData,
    baseUiSchema,
    fieldOrder = [],
    dataProviders = {},
    initialized = true,
    subfieldName,
    subfieldSchema,
    subfieldUiSchema,
    subfieldFormData
  ) => {
    /*
     * Returns a {schema,uiSchema,formData} after autofetching enums and changing fields as required by schemas
     */
    const schema = FormUtils.clone(subfieldSchema || ctx.state.schema)
    const properties = schema.properties
    const uiSchema = FormUtils.clone(subfieldUiSchema || ctx.state.uiSchema)
    let parentFieldClearedChildren = false
    let nextField
    let nextFieldName
    let changes = { schema, uiSchema, formData }
    for (let i = 0, fieldName; i < fieldOrder.length; i++) {
      // Iterate through each field of the depdency chain and determine appropriate course of action
      fieldName = fieldOrder[i]
      // If parent field has cleared the child fields, then no need to make updates
      if (parentFieldClearedChildren && initialized) {
        continue
      }

      // If a field has no value, ensure that children fields are reset and that the data for the field starts loading
      if (!formData[fieldName] || !initialized) {
        const field = properties[fieldName]
        if (!field) {
          continue
        }
        if (!formData[fieldName] && !field.isLoading) {
          parentFieldClearedChildren = true
          const fieldsToClear = fieldOrder.slice().splice(i + 1)
          FormUtils.resetFieldsInSchema(formData, schema, uiSchema, fieldsToClear)
        }

        const totalChanges = await FormUtils.updateDynamicFormField(
          ctx,
          baseUiSchema,
          schema,
          uiSchema,
          formData,
          fieldName,
          field,
          dataProviders,
          subfieldName
        )

        if (totalChanges.disregard) {
          return null
        } else if (!formData[fieldName]) {
          return totalChanges
        } else {
          changes = FormUtils.clone(changes)
          changes.schema.properties[fieldName] = totalChanges.schema.properties[fieldName]
          changes.uiSchema[fieldName] = totalChanges.uiSchema[fieldName]
          changes.formData[fieldName] = totalChanges.formData[fieldName]
        }
      } else if (FormUtils.isFieldChanged(ctx, formData, fieldName, subfieldFormData) && initialized) {
        // If a field in the dependency has changed, operate on the child fields to:
        //   1) ensure they are cleared
        //   2) the next field in the order is loading data

        nextFieldName = fieldOrder[i + 1]
        nextField = properties[nextFieldName]

        // Clear all the fields that are dependent
        const fieldsToClear = fieldOrder.slice().splice(i + 1)
        parentFieldClearedChildren = true
        FormUtils.resetFieldsInSchema(formData, schema, uiSchema, fieldsToClear)

        if (!nextField) {
          continue
        }

        const nextChanges = await FormUtils.updateDynamicFormField(
          ctx,
          baseUiSchema,
          schema,
          uiSchema,
          formData,
          nextFieldName,
          nextField,
          dataProviders,
          subfieldName
        )

        return nextChanges.disregard ? null : nextChanges
      }
    }
    return changes
  }

  static resetFieldsInSchema (formData, schema, uiSchema, fields) {
    fields.forEach(fieldName => {
      const field = schema.properties && schema.properties[fieldName]
      if (!field) {
        return
      }
      field.isLoading = false
      field.hasLoaded = false
      field.data = []

      delete formData[fieldName]
      if (field.enum && field['custom:dataProvider']) {
        field.enum = []
        field.enumNames = []
      }
      if (field['custom:requiredWhenShown']) {
        FormUtils.setRequired(schema, [fieldName], false)
      }
      if (field['custom:autoShow']) {
        FormUtils.hideFields({}, uiSchema, [fieldName])
      }
    })
  }

  static updateDynamicFormField = async (
    ctx,
    baseUiSchema,
    schema,
    uiSchema,
    formData,
    fieldName,
    field,
    dataProviders,
    subfieldName
  ) => {
    if (field && field['custom:autoShow']) {
      FormUtils.showFields(baseUiSchema, uiSchema, [fieldName])
    }

    if (field && field['custom:requiredWhenShown']) {
      FormUtils.setRequired(schema, [fieldName], true)
    }

    if (!field.hasLoaded && field['custom:dataProvider']) {
      const providerName = field['custom:dataProvider']
      const dataProvider = dataProviders[providerName] || (schema.dataProviders && schema.dataProviders[providerName])
      if (dataProvider) {
        return await FormUtils.updateFieldByDataProvider(
          ctx,
          baseUiSchema,
          schema,
          uiSchema,
          formData,
          fieldName,
          field,
          dataProvider,
          subfieldName
        )
      }
    }

    return { schema, uiSchema, formData }
  }

  static updateFieldByDataProvider = async (
    ctx,
    baseUiSchema,
    schema,
    uiSchema,
    formData,
    fieldName,
    field,
    dataProvider,
    subfieldName
  ) => {
    FormUtils.setLoadingFields(baseUiSchema, uiSchema, [fieldName], true)

    field.isLoading = true
    field.data = []

    // if (field.enum && !field['custom:existingValueIsNotName']) {
    //   field.enumNames.push(formData[fieldName])
    //   field.enum.push(formData[fieldName])
    // }

    const requestId = ((dataProvider[fieldName] || 0) + 1) % 100
    dataProvider[fieldName] = requestId
    const stateTransition = subfieldName
      ? FormUtils.setSubFormState(ctx, subfieldName, schema, uiSchema, formData)
      : FormUtils.setFormState(ctx, schema, uiSchema, formData)

    await stateTransition

    if (field.enum) {
      const changes = await FormUtils.eventuallyUpdateDynamicEnumField(
        ctx,
        baseUiSchema,
        schema,
        uiSchema,
        dataProvider,
        fieldName,
        formData
      )
      if (dataProvider[fieldName] !== requestId) {
        return { disregard: true }
      }

      return changes
    } else {
      const data = await dataProvider({ formData, formProps: ctx.props })

      schema = FormUtils.clone(schema)
      uiSchema = FormUtils.clone(uiSchema)
      const field = schema.properties[fieldName]
      field.isLoading = false
      field.hasLoaded = true
      field.data = data
      FormUtils.setLoadingFields(baseUiSchema, uiSchema, [fieldName], false)
      if (dataProvider[fieldName] !== requestId) {
        return { disregard: true }
      }
      return { schema, uiSchema, formData }
    }
  }

  static eventuallyUpdateDynamicEnumField = async (
    ctx,
    baseUiSchema,
    schema,
    uiSchema,
    enumSource,
    fieldName,
    formData
  ) => {
    const results = await enumSource({ formData, formProps: ctx.props })
    schema = FormUtils.clone(schema)
    uiSchema = FormUtils.clone(uiSchema)
    // const uiSchema = FormUtils.clone(ctx.state.uiSchema)
    const field = schema.properties[fieldName]
    field.isLoading = false
    field.hasLoaded = true

    if (results && results.transformedData) {
      field.data = results.data || null
      FormUtils.setEnumAndNames(field, results.transformedData || [])
    } else {
      field.data = results || null
      FormUtils.setEnumAndNames(field, results || [])
    }

    if (results.customOptions) {
      FormUtils.setCustomOptions(field, results.customOptions)
    }
    FormUtils.setLoadingFields(baseUiSchema, uiSchema, [fieldName], false)

    return { schema, uiSchema, formData }
  }

  static setSubFormState = (ctx, subfieldName, schema, uiSchema, formData) => {
    return new Promise(resolve => {
      ctx.setState(
        prevState => {
          const result = {
              schema: FormUtils.clone(prevState.schema),
              uiSchema: FormUtils.clone(prevState.uiSchema),
              formData: FormUtils.clone(prevState.formData)
            },
            subSchema = {},
            subUiSchema = {},
            subFormData = {}

          subSchema[subfieldName] = schema
          subUiSchema[subfieldName] = uiSchema
          subFormData[subfieldName] = formData

          Object.assign(result.schema, subSchema)
          Object.assign(result.uiSchema, subUiSchema)
          Object.assign(result.formData, subFormData)

          return result
        },
        () => resolve()
      )
    })
  }

  static setFormState = (ctx, baseSchema, baseUiSchema, formData = {}) => {
    return new Promise(resolve => {
      ctx.setState(
        {
          schema: FormUtils.clone(baseSchema),
          uiSchema: FormUtils.clone(baseUiSchema),
          formData: FormUtils.clone(formData)
        },
        () => resolve()
      )
    })
  }

  static mergeSchema (schema, addPatchSchema, fieldOrder = [], isFormSchema = false) {
    const result = FormUtils.mergeOrderedProperties(schema, addPatchSchema, fieldOrder)
    if (isFormSchema) {
      result.dataProviders = Object.assign({}, schema.dataProviders, addPatchSchema.dataProviders)
      result.properties = FormUtils.mergeOrderedProperties(schema.properties, addPatchSchema.properties, fieldOrder)
      result.required = [].concat(schema.required, addPatchSchema.required)
    }

    return result
  }

  static mergeOrderedProperties (sourceObj, patchObj, ordering = []) {
    const mergedObj = Object.assign({}, sourceObj, patchObj)
    const orderedResult = {}
    ordering.forEach(function (prop) {
      if (mergedObj[prop]) {
        orderedResult[prop] = mergedObj[prop]
        delete mergedObj[prop]
      }
    })

    return Object.assign(orderedResult, mergedObj)
  }

  static reduceSchema (schema, uiSchema, formData) {}
}



// WEBPACK FOOTER //
// ../src/components/Utils/FormUtils.js