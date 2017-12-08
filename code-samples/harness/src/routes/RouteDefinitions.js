export default {
  /**
   * This is an example route for development
   * Example usage inside a Page Container -> this.props.path.toDevWiki({ accountId: 'test-account-id' }, { foo: 'bar'})
   * See Test Page for interactive demo.
   */

  toDevWiki: ({ accountId }) => `/account/${accountId}/dev-wiki`,

  toSetup: ({ accountId }) => `/account/${accountId}/setup`,

  toAppDetails: ({ accountId, appId }) => `/account/${accountId}/app/${appId}/details`,

  toServiceInstancesSummary: ({ accountId, appId, serviceId }) =>
    `/account/${accountId}/service-instances/app/${appId}/service/${serviceId}`,

  toDeployments: ({ accountId }) => `/account/${accountId}/deployments`,

  toDeploymentDetails: ({ accountId, appId, execId }) => `/account/${accountId}/app/${appId}/deployments/${execId}`,

  toSetupAsCode: ({ accountId }) => `/account/${accountId}/setup-as-code`,

  toEnvironmentsDetails: ({ accountId, appId, envId }) =>
    `/account/${accountId}/app/${appId}/environments/${envId}/details`,

  toApplicationEnvironments: ({ accountId }) => `/account/${accountId}/application-details/setup-environments`,

  toEnvironmentDetails: ({ accountId }) => `/account/${accountId}/application-details/environments/detail`,

  toExecutionDetails: ({ accountId, appId, envId, execId }) =>
    `/account/${accountId}/app/${appId}/env/${envId}/executions/${execId}/details`,

  toContinuousVerification: ({ accountId }) => `/account/${accountId}/continuous-verification`,

  // //////////////////////// Services Dashboard /////////////////////////////////////////
  toServiceDashboard: ({ accountId }) => `/account/${accountId}/services`,
  toServiceDetails: ({ accountId, appId, serviceId }) =>
    `/account/${accountId}/service-instances/app/${appId}/service/${serviceId}`,
  // //////////////////////// Services Dashboard /////////////////////////////////////////

  // //////////////////////// Setup Pages /////////////////////////////////////////
  toSetupServices: ({ accountId, appId }) => `/account/${accountId}/app/${appId}/services`,
  toSetupServiceDetails: ({ accountId, appId, serviceId }) =>
    `/account/${accountId}/app/${appId}/services/${serviceId}/details`,

  toSetupEnvironments: ({ accountId, appId }) => `/account/${accountId}/app/${appId}/environments`,
  toSetupEnvironmentDetails: ({ accountId, appId, envId }) =>
    `/account/${accountId}/app/${appId}/environments/${envId}/details`,

  toSetupWorkflow: ({ accountId, appId }) => `/account/${accountId}/app/${appId}/workflows`,
  toSetupWorkflowDetails: ({ accountId, appId, workflowId }) =>
    `/account/${accountId}/app/${appId}/workflows/${workflowId}/details`,
  toSetupWorkflowPhaseDetails: ({ accountId, appId, workflowId, phaseId }) =>
    `/account/${accountId}/app/${appId}/workflows/${workflowId}/phases/${phaseId}/details`,

  toSetupPipeLines: ({ accountId, appId }) => `/account/${accountId}/app/${appId}/pipelines`,
  toSetupPipeLinesEdit: ({ accountId, appId, pipelineId }) =>
    `/account/${accountId}/app/${appId}/pipelines/${pipelineId}/edit`,
  toSetupPipeLinesNew: ({ accountId, appId }) => `/account/${accountId}/app/${appId}/pipelines/new`,

  toSetupTriggers: ({ accountId, appId }) => `/account/${accountId}/app/${appId}/triggers`,

  toSetupTriggersV2: ({ accountId, appId }) => `/account/${accountId}/app/${appId}/triggers-v2`,

  toSetupDelegates: ({ accountId }) => `/account/${accountId}/installation`,

  toSecretsManagement: ({ accountId }) => `/account/${accountId}/secrets-management`,

  toKmsListPage: ({ accountId }) => `/account/${accountId}/kmslist`,
  toSetupServiceCommand: ({ accountId, appId, serviceId, commandId }) =>
    `/account/${accountId}/app/${appId}/services/${serviceId}/commands/${commandId}/editor`
  // //////////////////////// Setup Pages /////////////////////////////////////////
}



// WEBPACK FOOTER //
// ../src/routes/RouteDefinitions.js