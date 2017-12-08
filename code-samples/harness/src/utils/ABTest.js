export default class ABTest {
  static get isLocalHost () {
    return location.hostname === 'localhost'
  }

  static get isProduction () {
    return location.hostname === 'app.harness.io'
  }

  static get isCurrentUserHarness () {
    return /@harness.io$/.test(localStorage.email)
  }

  static get isDeploymentV2Enabled () {
    return true
  }

  static get isExecutionFetchingOptimizationEnabled () {
    return true
  }

  static get isApplicationDefaultsEnabled () {
    return true
  }
}



// WEBPACK FOOTER //
// ../src/utils/ABTest.js