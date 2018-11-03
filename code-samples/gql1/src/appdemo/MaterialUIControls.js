/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment, PureComponent } from 'react'
import Color from 'color'
import Typography from '@material-ui/core/Typography'
import {default as ButtonUI} from '@material-ui/core/Button'

import {H1, H2, H3, H4, H5, H6, Body, Body2, S1, S2, Button} from 'appmaterial-ui'
import { Grid } from 'apputil'

import Brown from './BrownT'
import NightSwatch from './NightSwatch'

const swatchSize = 5 * 96 // 5" in pixles
const gridProps = {
  containerStyles: `margin-bottom: 16px`,
  spacing: 40,
}

export default class MaterialUIControls extends PureComponent {
  state = {hideDefault: false}

  hideAction = e => this.setState({hideDefault: !this.state.hideDefault})

  render() {
    const {hideDefault} = this.state

    return <Fragment>
      <H1>Material UI - Themed</H1>
      <H2>Typography</H2>
      <Body>
        h1: 72pt: top heading above<br />
        h2: 45pt: Typograhy heading above
      </Body>
      <H3>h3: 36pt</H3>
      <H4>h4: 25.5pt</H4>
      <H5>h5: 18pt</H5>
      <H6>h6: 15pt</H6>
      <Typography variant='body1' paragraph>Default body1: 10.5pt margin-bottom: 16px</Typography>
      <Body>Body: 15pt</Body>
      <Body2>Body2: 15pt, no bottom margin</Body2>
      <S1>Subtitle1: 12pt</S1>
      <S2>Subtitle2: 10.5pt bold</S2>
      <H2><div onClick={this.hideAction}>Buttons</div></H2>
      <Body>
        Click Buttons heading to hide default-styled buttons<br />
        <strong>fab</strong>: in Material-UI, floating action button, the primary action for a page
      </Body>
      <H3>Button Colors</H3>
      <Grid {...gridProps}>
        <Button variant='contained'>Default</Button>
        <Button variant='contained' color='primary'>Primary</Button>
        <Button variant='contained' color='secondary'>Secondary</Button>
        <Button variant='contained' color='secondary' disabled>Disabled</Button>
      </Grid>
      {!hideDefault &&
        <Grid {...gridProps}>
          <ButtonUI variant='contained'>Default</ButtonUI>
          <ButtonUI variant='contained' color='primary'>Primary</ButtonUI>
          <ButtonUI variant='contained' color='secondary'>Secondary</ButtonUI>
          <ButtonUI variant='contained' color='secondary' disabled>Disabled</ButtonUI>
        </Grid>}
      <H3>Button Variants</H3>
      <Grid {...gridProps}>
        <Button>text</Button>
        <Button variant='outlined'>outlined</Button>
        <Button variant='contained'>contained</Button>
        <Button variant='fab'>fab</Button>
        <Button variant='extendedFab'>extendedFab</Button>
      </Grid>
      {!hideDefault &&
        <Grid {...gridProps}>
          <ButtonUI>text</ButtonUI>
          <ButtonUI variant='outlined'>outlined</ButtonUI>
          <ButtonUI variant='contained'>contained</ButtonUI>
          <ButtonUI variant='fab'>fab</ButtonUI>
          <ButtonUI variant='extendedFab'>extendedFab</ButtonUI>
        </Grid>}
      <H3>Button Sizes</H3>
      <Grid {...gridProps}>
        <Button mini variant='fab'>mini</Button>
        <Button size='small' variant='contained'>small</Button>
        <Button variant='contained'>medium</Button>
        <Button size='large' variant='contained'>large</Button>
      </Grid>
      {!hideDefault &&
        <Grid {...gridProps}>
          <ButtonUI mini variant='fab'>mini</ButtonUI>
          <ButtonUI size='small' variant='contained'>small</ButtonUI>
          <ButtonUI variant='contained'>medium</ButtonUI>
          <ButtonUI size='large' variant='contained'>large</ButtonUI>
        </Grid>}
      <H2>Prevent Theming</H2>
      <Brown>Always Brown</Brown>
      <H2>Color-Plane</H2>
      <Body>Night red-shift red and green Colorplane</Body>
      <Body><NightSwatch height={swatchSize} width={swatchSize} steps={50} /></Body>
      <Body>
        Conclusions
        <ul>
          <li>Have red and green below 100
            <ul>
              <li>Avoids too green, too red and too orange</li>
            </ul>
          </li>
          <li>For lighter colors than that, have red and green about equal up to 200
            <ul>
              <li>Avoids too yellow</li>
            </ul>
          </li>
          <li>Luminosity of (100, 100, 0): {(Color('#646400').luminosity() * 100).toFixed(1)}%</li>
          <li>Luminosity of (200, 200, 0): {(Color('#c8c800').luminosity() * 100).toFixed(1)}%</li>
          <li>Luminosity of ginger (174, 96, 0): {(Color('#ae6000').luminosity() * 100).toFixed(1)}%</li>
        </ul>
      </Body>
    </Fragment>
  }
}
