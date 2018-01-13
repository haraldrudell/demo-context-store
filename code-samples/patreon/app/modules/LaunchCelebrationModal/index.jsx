import { attachModule } from 'libs/modules'

import LaunchCelebrationContainer from './containers/LaunchCelebrationContainer/'

import reducer from './core'
export * from './core'

export default attachModule('launch', reducer)(LaunchCelebrationContainer)



// WEBPACK FOOTER //
// ./app/modules/LaunchCelebrationModal/index.jsx