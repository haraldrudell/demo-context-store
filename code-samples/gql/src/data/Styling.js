/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, Fragment} from 'react'
import Typography from '@material-ui/core/Typography'
import injectSheet from 'react-jss'
import styled from 'styled-components'

const styles = { // use jss for the CSS API classes property of the Typography component
  root: { // apply to the root element: p
    color: 'red',
  }
}
const Typography1 = injectSheet(styles)(Typography)

// jss also has a decorator @injectSheet(styles) that can be applied to a class via the classes prop

// jss HOC is: <ThemeProvider theme={theme}>

// Material-UI has HOC MuiThemeProvider https://material-ui.com/customization/themes/#muithemeprovider

// Material-UI has withTheme()(Component) => Component

// Material-UI has withStyles()() https://material-ui.com/customization/overrides/

// Material-UI therefore uses withStyles or withTheme

// use of styled components with Material-UI: https://material-ui.com/guides/interoperability/
const Typography2 = styled(Typography)`
    color: red
`

// styled components theme to Material-UI: to be researched

export default class Styled extends Component {
  render() {
    return <Fragment>
        <p>There are 3 factors for styling:</p>
        <ul>
          <li><strong>Material-UI</strong> is used for components&nbsp;<a href="https://material-ui.com">https://material-ui.com</a>
            <ul>
              <li>A component may have props that provides styling like <strong>align</strong> or <strong>color</strong> for <strong>Typography</strong></li>
              <li>The classes prop of a component provides a CSS API via an object with css class name overrides like <strong>{'{'}root, button}</strong></li>
              <li>On DOM elements, the <strong>style={'{{'}color: 'red'}}</strong> type attributes</li>
            </ul></li>
          <li><strong>Material-UI</strong> uses <strong>jss</strong> for styling&nbsp;
            <a href="https://cssinjs.org/react-jss">https://cssinjs.org/react-jss</a></li>
          <li><strong>styled-components</strong> is the preferred styling library&nbsp;<a href="https://www.styled-components.com">https://www.styled-components.com</a></li>
        </ul>
        <Typography>Typography</Typography>
        <Typography1>jss injectSheet</Typography1>
        <Typography2>styled components styled()`` with &&</Typography2>
      </Fragment>
  }
}
