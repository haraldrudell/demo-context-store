import React, { Component, Fragment } from 'react'
import styled, {css, ThemeProvider, withTheme} from 'styled-components'
import './App.css' // add some non-interfering global styles

const complexMixin = css`
  color: white
`
console.log('complexMixin', complexMixin) // ["↵  color: white↵"]

export default class App extends Component {
  render() {
    return <Fragment>
      <section>
        <h1>styled-components</h1>
        <p>Version: 4.0.2 of October 17, 2018</p>
      </section>
      <section>
        <h2>Benefits</h2>
        <ul>
          <li>Standard css located in each React component</li>
          <li>Injects styles of only the rendered components</li>
          <li>Css rules are automatically vendor prefixed</li>
        </ul>
      </section>
      <section>
        <h2>Usage</h2>
        <h3>Applying css to elements and components</h3>
        <ul>
          <li>Styling html elements using <strong>styled.h1</strong> <a href="https://www.styled-components.com/docs/basics#getting-started">Element Styling</a><br />
            This adds a class property to the html element.
            <ul>
              <li><strong>as</strong> JSX prop can style as a different html element <a href="https://www.styled-components.com/docs/api#as-polymorphic-prop">as</a></li>
            </ul>
          </li>
          <li>Extend component styling using <strong>styled(Component)</strong> constructor <a href="https://www.styled-components.com/docs/basics#extending-styles">Extending Styles</a><br />
            The component gets a css class name in this.props.className that should be used on html element using the JSX prop className={'{'}className}
          </li>
          <li>Create a component that injects global css rules using <strong>createGlobalStyle</strong> <a href="https://www.styled-components.com/docs/api#createglobalstyle">createGlobalStyle</a><br />
            const Component = createGlobalStyle`body {'{'}color: black}`
          </li>
        </ul>
        <h3>Use of props to modify css</h3>
        <ul>
          <li>Use of props for css values <a href="https://www.styled-components.com/docs/basics#passed-props">Passed props</a><br />
              By using a function in the css, like {'{'}props => props.someProp | 'white'}, css can be based on or overriden by arbitrary JSX props</li>
          <li>Generate css inline <a href="https://www.styled-components.com/docs/api#css">css</a><br />
            Produces an interpolated string of css that can be inserted inside another backtick css expression, enabling multiple levels of interpolation
          </li>
        </ul>
        <h3>Use of advanced css features</h3>
        <ul>
          <li>Pseudo selectors like :hover and ::before <a href="https://www.styled-components.com/docs/basics#pseudoelements-pseudoselectors-and-nesting">Pseudo Selectors</a></li>
          <li>Keyframes for animations <a href="https://www.styled-components.com/docs/basics#animations">Animations</a></li>
          <li>In the css, ampersand refers to the css style rule name and styling can be applied to children<br />
            > * {'{'}<br />
            &emsp;margin-left: 20px<br />
            }
          </li>
        </ul>
        <h3>Theming</h3>
        <ul>
          <li>Theming using React 16 contexts: <a href="https://www.styled-components.com/docs/advanced#theming">Theming</a><br />
            A theme is a key-value dictionary, not css
            <ul>
              <li>Inject the theme context using ThemeProvider</li>
              <li>Provide ability to switch themes</li>
              <li>styled provides props.theme usable by interpolating functions in css</li>
              <li>withTheme provides props.theme for use other than styled-components</li>
            </ul>
            {'<'}ThemeProvider theme={'{'}theme}><br />
            &emsp;css using styled in components here have props.theme available<br />
            {'<'}/ThemeProvider></li>
            <li>High order component withTheme <a href="https://www.styled-components.com/docs/api#withtheme">withTheme</a><br />
            withTheme makes a JSX prop theme available, that can be used for css styling or override with the passed props feature: `color: {'{'}this.props.theme.color}`
          </li>
        </ul>
        </section>
      <section>
        <h2>Resources</h2>
        <ul>
          <li>list: <a href="https://github.com/styled-components/awesome-styled-components">Styled components</a></li>
        </ul>
      </section>
      <section>
        <h2>Theme Design</h2>
        <ul>
          <li>Theme names: light, dark</li>
          <li>Theme colors: primary, secondary, danger, alert, success, background, active, default</li>
          <li>Theme control styles: default, primary, success, warning</li>
          <li>Theme control sizes: large, small</li>
          <li>Theme fonts: primary, pre, quote</li>
          <li>Theme sizes: maxWidth</li>
        </ul>
      </section>
      <StyledP>Styled paragraph.</StyledP>
      <StyledComponent />
      <ThemedComponent />
    </Fragment>
  }
}

// styling a React Component
const ComponentToBeStyled = ({className}) => <p className={className}>Styled component.</p>
const StyledComponent = styled(ComponentToBeStyled)`
color: green
`

// styling an html element
const StyledP = styled.p`
  color: red
`

// theming
class Themer extends Component {
  themes = [{
    color: 'green',
  },{
    color: 'red',
  }]
  state = {activeTheme: 0}

  changeTheme = e => this.setState({activeTheme: 1 - this.state.activeTheme})

  render() {
    const {state: {activeTheme}, props: {children}, themes} = this
    const theme = themes[activeTheme]

    return <ThemeProvider theme={theme}>{/* make a React 16 context available for styled components */}
      <Fragment>{/* both ThemeProvider and ThemeConsumer must have exactly one child so you may have to wrap using Fragment */}
        {children}

        <div>{/* implement a simple theme switcher */}
          <button onClick={this.changeTheme}>Change theme</button>
        </div>
      </Fragment>
    </ThemeProvider>
  }
}

const LogProps = props => {
  console.log(props.heading, props) // check that styled injected props.theme
  return false // render nothing
}
const PickupTheme = styled(LogProps)``

// when rendered inside a withTheme component, props.theme is available
const StyledButton = styled.button`
color: ${props => props.theme.color}
border: 2px solid ${props => props.theme.color}
`
StyledButton.defaultProps = {theme: {
  color: 'orange'
}}

const UseWithTheme = withTheme(LogProps)

const ThemedComponent = () =>
  <Themer>{/* injects theme data and handles theme switching */}
    <LogProps heading='without styled:' />{/* component that does not have theme available */}
    <PickupTheme heading='theme injected by styled constructor' />{/* component with theme via styled constructor */}
    <StyledButton>Button themed by styled constructor</StyledButton>{/* themed component using styled constructor */}
    <UseWithTheme heading='withTheme acquires theme for use other than styled-somponents' />
  </Themer>
