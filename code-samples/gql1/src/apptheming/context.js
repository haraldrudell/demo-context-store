/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { createContext, memo } from 'react'

export const {Provider: SwitchProvider, Consumer: SwitchConsumer} = createContext()

// export default withThemeData(Component)
export const withThemeData = Component => memo(props =>
  <SwitchConsumer>{themeData =>
    <Component {...props} themeData={themeData} />}
  </SwitchConsumer>)
