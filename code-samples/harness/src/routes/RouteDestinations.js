import React from 'react'
import { Router, Route, Redirect, browserHistory } from 'react-router'

import RoutePaths from './RoutePaths'
/* eslint-disable max-len */

import App from 'containers/App/App'
import ApplicationPage from 'containers/ApplicationPage/ApplicationPage'
import ApplicationInfoPage from 'containers/ApplicationPage/ApplicationInfoPage'
import AppOverview from 'containers/AppOverview/AppOverview'
import ServicePage from 'containers/ServicePage/ServicePage'
import AppContainerPage from 'containers/AppContainerPage/AppContainerPage'
// import EnvironmentPage from './EnvironmentPage/EnvironmentPage'
import HostPage from 'containers/HostPage/HostPage'
import ServiceTemplatePage from 'containers/ServiceTemplatePage/ServiceTemplatePage'
import ServiceTemplateDetailPage from 'containers/ServiceTemplateDetailPage/ServiceTemplateDetailPage'
import TagPage from 'containers/TagPage/TagPage'
import WorkflowPOCPage from 'containers/WorkflowPage/WorkflowPOCPage'
import ArtifactPage from 'containers/ArtifactPage/ArtifactPage'
import ArtifactStreamPage from 'containers/ArtifactStreamPage/ArtifactStreamPage'
// import TriggerPage from 'containers/TriggerPage/TriggerPage'
import PipelinePage from 'containers/PipelinePage/PipelinePage'
import DeploymentPage from 'containers/DeploymentPage/DeploymentPage'
import DeploymentsDashboard from '../pages/deployments/DeploymentsDashboard'
import ServicesDashboardPage from 'containers/ServicesDashboardPage/ServicesDashboardPage'
import ServiceInstancesSummaryPage from 'containers/ServiceInstancesSummaryPage/ServiceInstancesSummaryPage'
// import InfrastructureDashboardPage from 'containers/InfrastructureDashboardPage/InfrastructureDashboardPage'
// import InfrastructureInstancesSummaryPage from 'containers/InfrastructureInstancesSummaryPage/InfrastructureInstancesSummaryPage'
import WorkflowPage from 'containers/WorkflowPage/WorkflowPage'
import ActivityPage from 'containers/ActivityPage/ActivityPage'
import PipelineEditorPage from 'containers/PipelineEditorPage/PipelineEditorPage'
import ServiceInstancePage from 'containers/ServiceInstancePage/ServiceInstancePage'
// import OrchestrationPage from 'containers/OrchestrationPage/OrchestrationPage'
import WorkflowListPage from 'containers/OrchestrationPage/WorkflowListPage'
import LoginSkin from 'containers/LoginSkin/LoginSkin'
import LoginPage from 'containers/LoginPage/LoginPage'
import ForgotPasswordPage from 'containers/LoginPage/ForgotPasswordPage'
import ResetPasswordPage from 'containers/LoginPage/ResetPasswordPage'
import RegisterPage from 'containers/RegisterPage/RegisterPage'
import SignUpThanksPage from 'containers/RegisterPage/SignUpThanksPage'
import InviteCompletionPage from 'containers/InviteCompletionPage/InviteCompletionPage'
import RegistrationVerifyPage from 'containers/RegisterPage/RegistrationVerifyPage'
import OrchestrationEditorPage from 'containers/OrchestrationEditorPage/OrchestrationEditorPage'
// import CanaryQuestionnaires from './OrchestrationPage/CanaryQuestionnaires'
import CanaryQuestionnairesEditor from 'containers/OrchestrationPage/CanaryQuestionnairesEditor'
// import DeploymentPhaseDetail from './OrchestrationPage/DeploymentPhaseDetail'
import CDStatusPage from 'containers/CDStatusPage/CDStatusPage'
import CommandEditorPage from 'containers/CommandEditorPage/CommandEditorPage'
import AppSetupBlankPage from 'containers/ApplicationPage/AppSetupBlankPage'
import Dashboard from 'containers/Dashboard/Dashboard'

import AccountPage from 'containers/AccountPage/AccountPage'
import AcctConnectorPage from 'containers/AcctConnectorPage/AcctConnectorPage'
import AcctCatalogPage from 'containers/AcctCatalogPage/AcctCatalogPage'
import AcctUserRolePage from 'containers/AcctUserRolePage/AcctUserRolePage'
import AcctPluginPage from 'containers/AcctPluginPage/AcctPluginPage'
import AcctSettingPage from 'containers/AcctSettingPage/AcctSettingPage'
import AccInstallationPage from 'containers/AccInstallationPage/AccInstallationPage'
import AcctCloudProviderPage from 'containers/AcctCloudProviderPage/AcctCloudProviderPage'
import AcctNotificationGroupPage from 'containers/AcctNotificationGroupPage/AcctNotificationGroupPage'
import ApplicationDetail from 'containers/ApplicationDetail/ApplicationDetail'
import InfrastructurePage from 'containers/InfrastructurePage/InfrastructurePage'
import ComputeProviders from 'containers/InfrastructurePage/ComputeProviders'
import BuildArtifact from 'containers/InfrastructurePage/BuildArtifact'
import Collaboration from 'containers/InfrastructurePage/Collaboration'
import Frameworks from 'containers/InfrastructurePage/Frameworks'
import Verification from 'containers/InfrastructurePage/Verification'

import RulesPage from 'containers/GovernancePage/RulesPage'
import RolesPage from 'containers/GovernancePage/RolesPage'
import UsersPage from 'containers/GovernancePage/UsersPage'

import SetupPage from 'containers/SetupPage/SetupPage'
import SecretsManagementPage from 'containers/SecretsManagementPage/SecretsManagementPage'
import KmsListPage from 'containers/SecretsManagementPage/KmsListPage'
import { Utils } from 'components'

import TestPage from 'containers/TestPage/TestPage'
import AccountSetupPage from 'containers/AccountSetupPage/AccountSetupPage'
import SetupAsCodePage from 'containers/SetupAsCode/SetupAsCodePage'

import ContinuousVerification from 'containers/ContinuousVerification/ContinuousVerification'

import ABTest from '../utils/ABTest'

const ActiveDeploymentPage = ABTest.isDeploymentV2Enabled ? DeploymentsDashboard : DeploymentPage

/**
 * The React Router routes for both the server and the client.
 */
const accountId = ':accountId'
const appId = ':appId'
const workflowId = ':workflowId'
const phaseId = ':phaseId'
const serviceId = ':serviceId'
const commandId = ':commandId'
const envId = ':envId'
const execId = ':execId'
const pipelineId = ':pipelineId'

module.exports = (
  <Router history={browserHistory}>
    <Route component={App} onEnter={Utils.requireAuth}>
      <Redirect from="/" to="/dashboard" />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/applications" component={ApplicationPage} />
      <Route path="/workflow" component={WorkflowPOCPage} />

      {/* Matt temp history Route  */}
      <Route path="/account/:accountId/history" component={ActivityPage} />

      <Route path={RoutePaths.toDevWiki({ accountId })} component={TestPage} />

      {/* --- APPLICATION menu --- */}
      <Route path="/blank" component={AppSetupBlankPage} />
      <Route path="/app/:appId/overview" component={AppOverview} />
      <Route path="/app/:appId/general" component={ApplicationInfoPage} />
      <Route path="/app/:appId/overview" component={AppOverview} />
      <Route path="/app/:appId/services" component={ServicePage} />

      <Route path="/app/:appId/app-containers" component={AppContainerPage} />
      <Route path="/app/:appId/service/:serviceId/command/:commandName/editor" component={CommandEditorPage} />
      <Route path="/app/:appId/setup" component={SetupPage} />

      {/* --- ENVIRONMENTS menu --- */}
      {/* <Route path="/app/:appId/environments" component={EnvironmentPage}/> */}
      <Route path="/app/:appId/env/:envId/hosts" component={HostPage} />
      <Route path="/app/:appId/env/:envId/service-templates" component={ServiceTemplatePage} />
      <Route
        path="/app/:appId/env/:envId/service-template/:serviceTemplateId/detail"
        component={ServiceTemplateDetailPage}
      />
      <Route path="/app/:appId/env/:envId/tags" component={TagPage} />

      {/* --- RELEASES menu --- */}
      <Route path="/app/:appId/artifacts" component={ArtifactPage} />
      <Route path="/app/:appId/delivery-pipelines" component={PipelinePage} />
      <Route path="/app/:appId/pipeline/:pipelineId/editor" component={PipelineEditorPage} />

      {/* --- ARTIFACTS --- */}
      <Route path="/app/:appId/artifact-setup" component={ArtifactStreamPage} />

      {/* --- DELIVERY menu --- */}
      <Route path="/app/:appId/continuous-delivery" component={CDStatusPage} />
      <Route path="/app/:appId/env/:envId/executions" component={ActiveDeploymentPage} />
      <Route path="/app/:appId/env/:envId/execution/:executionId/detail" component={WorkflowPage} />
      <Route path="/app/:appId/env/:envId/activities" component={ActivityPage} />
      <Route path="/app/:appId/env/:envId/service-instances" component={ServiceInstancePage} />
      {/* <Route path="/app/:appId/env/:envId/orchestration" component={OrchestrationPage} />
      <Route path="/app/:appId/workflows-old" component={OrchestrationPage} /> */}
      <Route path="/app/:appId/workflows" component={WorkflowListPage} />
      <Route path="/app/:appId/workflow/:workflowId/editor-old" component={OrchestrationEditorPage} />
      <Route path="/app/:appId/workflow/:workflowId/canary-questions" component={ApplicationDetail} />
      <Route path="/app/:appId/workflow/:workflowId/editor" component={CanaryQuestionnairesEditor} />
      <Route path="/app/:appId/env/:envId/orchestration/:orchestrationId/editor" component={OrchestrationEditorPage} />
      <Route path="/app/:appId/workflow/:workflowId/deploy-phase/:phaseId/detail" component={ApplicationDetail} />

      {/* --- INFRASTRUCTURE menu --- */}
      <Route path="/infrastructure/compute-providers" component={ComputeProviders} />
      <Route path="/infrastructure/frameworks" component={Frameworks} />
      <Route path="/infrastructure/verification" component={Verification} />
      <Route path="/infrastructure/build-artifact" component={BuildArtifact} />
      <Route path="/infrastructure/collaboration" component={Collaboration} />
      <Route path="/infrastructure/organization" component={InfrastructurePage} />
      <Route path="/infrastructure/:settingPage" component={ComputeProviders} />

      {/* --- ACCOUNTS menu -- */}
      <Route path="/account" component={AccountPage} />
      <Route path="/account/connector" component={AcctConnectorPage} />
      <Route path="/account/catalog" component={AcctCatalogPage} />
      <Route path="/account/user-role" component={AcctUserRolePage} />
      <Route path="/account/plugin" component={AcctPluginPage} />
      <Route path="/account/setting" component={AcctSettingPage} />
      <Route path="/account/installation" component={AccInstallationPage} />
      <Route path="/account/cloud-providers" component={AcctCloudProviderPage} />
      <Route path="/account/notification-groups" component={AcctNotificationGroupPage} />

      {/* --- Governance menu --- */}
      <Route path="/governance/rules" component={RulesPage} />
      <Route path="/governance/roles" component={RolesPage} />
      <Route path="/governance/users" component={UsersPage} />
      <Route path="/governance/:governancePage" component={InfrastructurePage} />

      {/* New paths with accountid in the path*/}
      <Route path="/account/:accountId/pipelines" component={CDStatusPage} />
      <Route path="/account/:accountId/deployments" component={ActiveDeploymentPage} />
      <Route path="/account/:accountId/app/:appId/deployments/:execId" component={DeploymentsDashboard} />
      <Route path="/account/:accountId/services" component={ServicesDashboardPage} />

      {/* <Route path="/account/:accountId/infrastructure" component={InfrastructureDashboardPage} /> */}

      <Route
        path="/account/:accountId/service-instances/app/:appId/service/:serviceId"
        component={ServiceInstancesSummaryPage}
      />
      {/* <Route
        path="/account/:accountId/infrastructure-instances/app/:appId/infrastructure/:infrastructureId"
        component={InfrastructureInstancesSummaryPage}
      /> */}
      <Route path={RoutePaths.toSetup({ accountId })} component={AccountSetupPage} />
      <Route path={RoutePaths.toSetupAsCode({ accountId })} component={SetupAsCodePage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/account/:accountId/connector" component={AcctConnectorPage} />
      <Route path="/account/:accountId/catalogs" component={AcctCatalogPage} />
      <Route path="/account/:accountId/user-role" component={AcctUserRolePage} />
      <Route path="/account/:accountId/plugin" component={AcctPluginPage} />
      <Route path="/account/:accountId/setting" component={AcctSettingPage} />
      <Route path="/account/:accountId/installation" component={AccInstallationPage} />
      <Route path="/account/:accountId/cloud-providers" component={AcctCloudProviderPage} />
      <Route path="/account/:accountId/notification-groups" component={AcctNotificationGroupPage} />
      {/* https://localhost:8000/#/account/kmpySmUISimoRrJL6NL73w/app-details/services?appid=*/}

      <Route path="/account/:accountId/application-details/setup-workflows" component={ApplicationDetail} />
      {/* <Route path="/app/:appId/env/:envId/detail/inframappings" component={EnvironmentDetailPage}/>
      <Route path="/app/:appId/env/:envId/detail/overrides" component={EnvironmentDetailPage}/>
      <Route path="/account/:accountId/application-details/artifact-setup" component={ApplicationDetail} />
      <Route path="/account/:accountId/application-details/services/detail" component={ApplicationDetail}/>*/}
      <Route path="/account/:accountId/app/:appId/details" component={SetupPage} />

      <Route path={RoutePaths.toSetupServices({ accountId, appId })} component={ApplicationDetail} />
      <Route
        path={RoutePaths.toSetupServiceCommand({ accountId, appId, serviceId, commandId })}
        component={CommandEditorPage}
      />
      <Route path={RoutePaths.toSetupServiceDetails({ accountId, appId, serviceId })} component={ApplicationDetail} />
      <Route path={RoutePaths.toSetupEnvironments({ accountId, appId })} component={ApplicationDetail} />

      <Route path={RoutePaths.toSetupWorkflow({ accountId, appId })} component={ApplicationDetail} />
      <Route path={RoutePaths.toSetupWorkflowDetails({ accountId, appId, workflowId })} component={ApplicationDetail} />
      <Route
        path={RoutePaths.toSetupWorkflowPhaseDetails({ accountId, appId, workflowId, phaseId })}
        component={ApplicationDetail}
      />

      <Route path={RoutePaths.toEnvironmentsDetails({ accountId, appId, envId })} component={ApplicationDetail} />
      <Route path={RoutePaths.toSetupTriggers({ accountId, appId })} component={ApplicationDetail} />
      <Route path={RoutePaths.toSetupPipeLines({ accountId, appId })} component={ApplicationDetail} />
      <Route path={RoutePaths.toSetupPipeLinesNew({ accountId, appId })} component={ApplicationDetail} />
      <Route path={RoutePaths.toSetupPipeLinesEdit({ accountId, appId, pipelineId })} component={ApplicationDetail} />
      <Route path={RoutePaths.toEnvironmentDetails({ accountId })} component={ApplicationDetail} />

      <Route path={RoutePaths.toDeployments({ accountId })} component={ActiveDeploymentPage} />
      <Route path={RoutePaths.toDeploymentDetails({ accountId, appId, execId })} component={DeploymentsDashboard} />
      <Route path={RoutePaths.toExecutionDetails({ accountId, appId, envId, execId })} component={WorkflowPage} />

      <Route path={RoutePaths.toSecretsManagement({ accountId })} component={SecretsManagementPage} />

      <Route path={RoutePaths.toContinuousVerification({ accountId })} component={ContinuousVerification} />

      <Route path={RoutePaths.toKmsListPage({ accountId })} component={KmsListPage} />

      {/* <Route path={RoutePaths.toSetupTriggersV2({ accountId, appId })} component={TriggerPage} /> */}
    </Route>

    <Route component={LoginSkin}>
      <Route path="/login(/:params)" component={LoginPage} />
      <Route path="/forgot-password(/:params)" component={ForgotPasswordPage} />
      <Route path="/reset-password(/:params)" component={ResetPasswordPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/signup-thank-you(/:email)" component={SignUpThanksPage} />
      <Route path="/invite(/:params)" component={InviteCompletionPage} />
      <Route path="/register/verify(/:token)" component={RegistrationVerifyPage} />
    </Route>
  </Router>
)



// WEBPACK FOOTER //
// ../src/routes/RouteDestinations.js