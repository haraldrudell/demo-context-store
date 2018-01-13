import { attachModule } from 'libs/modules'

import MessageUserModal from './containers/MessageUserModal/'

import reducer from './core'
export * from './core'

export default attachModule('messageUser', reducer)(MessageUserModal)



// WEBPACK FOOTER //
// ./app/modules/MessageUserModal/index.jsx