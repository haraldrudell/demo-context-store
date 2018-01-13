import getWindow from 'utilities/get-window'

const windowOrFixture = getWindow()
const navigator = windowOrFixture.navigator || { userAgent: 'unknown' }

export const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
export const IS_ANDROID = /Android/.test(navigator.userAgent)

export const IS_CHROME = !!windowOrFixture.chrome



// WEBPACK FOOTER //
// ./app/utilities/browser.js