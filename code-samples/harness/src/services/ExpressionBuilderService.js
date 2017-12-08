import xhr from 'xhr-async'

export async function fetchVariables ({
  appId,
  entityType,
  entityId,
  serviceId = '',
  stateType = '',
  ref = _ => null
}) {
  const url = '/expression-builder'

  try {
    const { response: { resource: variables }, status } = await xhr.get(url, {
      params: {
        appId,
        entityType,
        entityId,
        serviceId,
        stateType
      },
      ref
    })

    if (status !== 200) {
      return { error: 'Failed to fetch variables', status }
    }

    return { variables }
  } catch (error) {
    return { error, status: 0 }
  }
}



// WEBPACK FOOTER //
// ../src/services/ExpressionBuilderService.js