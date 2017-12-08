import * as mentions from '@harnessio/mentions'
import { ExpressionBuilderService } from 'services'
import { Logger } from 'utils'

let xhrRef

/**
 * Create a fetch async function that fetches data for react-mentions.
 * @param {Object} options - Options.
 * @param {string} options.appId - Application id.
 * @param {string} options.entityType - Entity type.
 * @param {string} options.entityId - Entity id.
 * @param {string} options.serviceId - Service id.
 * @param {string} options.stateType - State type.
 */
async function fetchMentions ({
  appId,
  entityType,
  entityId,
  serviceId, // for entityType = 'ENVIRONMENT' | 'WORKFLOW'
  stateType // for entityType = 'WORKFLOW'
}) {
  if (xhrRef) {
    xhrRef.abort()
  }

  const { error, variables, status } = await ExpressionBuilderService.fetchVariables({
    appId,
    entityType,
    entityId,
    serviceId,
    stateType,
    ref: req => {
      xhrRef = req
    }
  })

  if (error) {
    if (status !== 0) {
      Logger.error({ message: 'Failed to fetch variables, mentions will not work. Error: ', error, status })
    }
  }

  return variables || []
}

/**
 * Register mentions for a type.
 * @param {Object} options - Options.
 * @param {string} options.type - Mentions type.
 * @param {string} options.args - Arguments passed to /expression-builder endpoint to get mentions data.
 * @param {boolean} options.reuse - True if data needs to be reused.
 */
export function registerForType ({ type, args, reuse }) {
  mentions.register(type, {
    data: async function (done) {
      done(await fetchMentions(args))
    }
  }, { reuse })
}

/**
 * Register mentions for a Mozilla form field.
 * @param {Object} options - Options.
 * @param {string} options.field - Mozilla JSON form field name.
 * @param {string} options.type - Mentions type.
 * @param {string} options.args - Arguments passed to /expression-builder endpoint to get mentions data.
 */
export function registerForField ({ field, type, args }) {
  const element = document.getElementById(`root_${field}`)

  element.setAttribute('data-mentions', type)
  element.setAttribute('autocomplete', 'off')

  mentions.register(type, {
    data: async function (done) {
      done(await fetchMentions(args))
    }
  }, { override: true })
}

export function enableMentionsForFields (fields = [], type) {
  fields.forEach(field => {
    const element = document.getElementById(`root_${field}`)

    if (element) {
      element.setAttribute('data-mentions', type)
      element.setAttribute('autocomplete', 'off')
    } else {
      console.error('Form field not found:', field)
    }
  })
}

export function unregister (type) {
  mentions.unregister(type)
}

// Set up mentions' defaults
mentions.setDefaults({
  identifiersSet: /[A-Za-z0-9_.'"\(\)]/,
  trigger: ['$', '${'],
  rule: '${__match__}',
  cached: true
})



// WEBPACK FOOTER //
// ../src/utils/MentionUtils.js