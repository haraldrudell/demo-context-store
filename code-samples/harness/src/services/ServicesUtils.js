/**
 * Utility function to get error message from a response.
 * @param {any} error - Error object from xhr request.
 * @param {any} response - Xhr response.
 * @returns {string} Detailed error message.
 */
export function errorMessageFromResponse (error, response) {
  const responseMessages = error && response && response.responseMessages
  return (
    (responseMessages && `${responseMessages[0].code}: ${responseMessages[0].message}`) ||
    ((error && error.message) || error)
  )
}



// WEBPACK FOOTER //
// ../src/services/ServicesUtils.js