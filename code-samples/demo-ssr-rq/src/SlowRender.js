import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
const delay = 500

export default memo(() => { //
  const end = Date.now() + delay
  while (DataCue.now() < end) ;
  return <div>SlowRender delay ms: ${delay}</div>
})
