/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { memo } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'

import { ThemeContext } from 'apptheming'

import JssInsertion from './JssInsertion'

export default memo(({themes, children}) =>
  <JssInsertion>{/* JssProvider first so that Material-UI css has lower prioprity than styled components */}
    <CssBaseline />{/* Material-UI normalize css reset */}
    <ThemeContext themes={themes}>{/* Provide context to theme selector, render-once-css from themes */}
      {children} {/* redrawn on theme switching */}
    </ThemeContext>
  </JssInsertion>
)
