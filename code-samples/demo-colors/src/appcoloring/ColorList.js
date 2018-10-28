/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, { memo, Fragment } from 'react'

import { ColorHeading, ColorDisplay } from './ColorDisplay'

/*
display:
rgb: 255 255 255
hsl: 360° 100% 100%
luminosity 100%
*/

export default memo(({colors}) => {
  return <Fragment>
    <div><ColorHeading /></div>{colors.map((c, i) =>
    <div key={i}><ColorDisplay color={c} /></div>
    )}
  </Fragment>
})
