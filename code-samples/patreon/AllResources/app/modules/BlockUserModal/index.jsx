import { attachModule } from 'libs/modules'

import BlockUserModal from './containers/BlockUserModal/'

import reducer from './core'
export * from './core'

export default attachModule('blockUser', reducer)(BlockUserModal)



// WEBPACK FOOTER //
// ./app/modules/BlockUserModal/index.jsx