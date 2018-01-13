import get from 'lodash/get'
import getWindow from 'utilities/get-window'

const DEVELOPMENT = 'development'
const DELTA = 'delta'
const PRODUCTION = 'production'
const EMAIL = 'email'
const TEST = 'test'

const _nodeEnv = process.env.NODE_ENV || DEVELOPMENT
const _buildEnv = process.env.BUILD_ENV || PRODUCTION
const _isDev = process.env.DEVELOPMENT_DEBUG || false

export const isDevelopment = () => _nodeEnv === DEVELOPMENT || _isDev
export const isDelta = () => _buildEnv === DELTA
export const isProduction = () => _nodeEnv === PRODUCTION && !_isDev
export const isEmail = () => _nodeEnv === EMAIL
export const isTest = () => _nodeEnv === TEST
export const isClient = () =>
    process.env.CLIENT !== false && process.env.CLIENT !== 'false'
export const getRuntimeEnvironment = () => _nodeEnv
export const getCurrentGitSHA = () =>
    get(getWindow(), 'patreon.presets.js_git_sha')



// WEBPACK FOOTER //
// ./app/shared/environment/index.js