/* eslint no-restricted-globals: 0 */
export default {
  isDashboard: ({ accountId }) => location.href.includes('/dashboard?') || location.href.endsWith('/dashboard'),

  isServiceDashboard: ({ accountId }) => /\/account\/(\w*)\/services[\/?]?/.test(location.href),

  isDeployments: ({ accountId }) => location.href.includes('/deployments?') || location.href.endsWith('/deployments'),

  isSetup: ({ accountId }) => location.href.includes('/setup?') || location.href.endsWith('/setup'),

  isEnvironmentsDetails: () => location.href.includes('/environments/') && location.href.includes('/details'),

  isSetupWorkflowPhaseDetails: () => location.href.includes('/phases/') && location.href.includes('/details'),

  isSetupWorkflowDetails: () =>
    !location.href.includes('/phases/') && location.href.includes('/workflows/') && location.href.includes('/details'),

  isSetupServiceDetails: () => location.href.includes('/services/') && location.href.includes('/details'),

  isUsersAndPermissions: ({ accountId }) =>
    location.href.includes('/user-role?') || location.href.endsWith('/user-role'),

  isContinuousVerification: ({ accountId }) =>
    location.href.includes('/continuous-verification?') || location.href.endsWith('/continuous-verification'),

  isAuditTrail: ({ accountId }) => location.href.includes('/history?') || location.href.endsWith('/history'),

  isSecretManagement: ({ accountId }) =>
    location.href.includes('/secrets-management?') || location.href.endsWith('/secrets-management'),

  isSetupTriggerV2: () => location.href.includes('/triggers-v2') || location.href.endsWith('/triggers-v2')
}



// WEBPACK FOOTER //
// ../src/routes/RouteVerifiers.js