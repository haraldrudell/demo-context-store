import React, {Component, Fragment} from 'react'
import styles from './App.css'

console.log(styles)
const appRed = {
  color: 'red',
}
const UnstyledParagraph = () => <span>This text is not red.</span>
const StyledParagraph = () => <span style={appRed}>Sub-component</span>

export default class App extends Component {

  render() {
    return <Fragment>
      <div className='appBg'>
        <div className='appTopBottom' />
        <div className='appMargin'>
          <h1>Project: CSS3 Demo</h1>
          <h2 className='appTopContent'>Project Specifics</h2>
          <ul className='appTopContent'>
            <li className='appTerm'><dl>Repository</dl><dt>gt:sw code-samples/css3-demo</dt></li>
            <li className='appTerm'><dl>React version</dl><dt>{React.version}</dt></li>
          </ul>
          <h2 className='appTopContent'>Conclusions</h2>
          <ul className='appTopContent'>
            <li>Apply styles to DOM elements using the className attribute</li>
            <li>Import styles in each React component from a component-specific style sheet</li>
          </ul>
          <h2 className='appTopContent'>CSS Modules</h2>
          <h2 className='appTopContent'>ReactJS Styling Options</h2>
          <ul className='appTopContent'>
            <li className='appTerm'><dl>Regular style sheet</dl><dt>Like Create React App src/App.css</dt></li>
            <li className='appTerm'><dl>Inline styling</dl><dt>Use of the style attributed as primary means for styling is not recommended.</dt></li>
            <li className='appTerm'><dl>CSS Modules</dl><dt>The preferred way.</dt></li>
            <li className='appTerm'><dl>Styled components</dl><dt>An npm module styled-components using ECMAScript template strings: bad.</dt></li>
          </ul>
          <p className='appTopContent'><a href='https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822'>https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822</a></p>
          <h2 className='appTopContent'>Create React App  styling</h2>
          <ul className='appTopContent'>
            <li className='appTerm'><dl>src/index.css</dl><dt>Removes margin and padding from body, sets font to sans-serif</dt></li>
            <li className='appTerm'><dl>src/App.css</dl><dt>Some class names prefixed with App</dt></li>
          </ul>
          <h2 className='appTopContent'>ReactJS inline styles</h2>
          <p className='appTopContent'>Inline styles are not recommended as the primary means of styling since they are not autoprefixed. An external style sheet and the classNames attribute should be used.<br />
            <a href='https://reactjs.org/docs/dom-elements.html#style'>https://reactjs.org/docs/dom-elements.html#style</a></p>
          <ul className='appTopContent'>
            <li className='appTerm'><dl>style attribute</dl><dt>DOM Elements can be styled using a style attribute with an ECMAScript object value.</dt></li>
            <li className='appTerm'><dl>style attribute on a React component does not work</dl><dt><UnstyledParagraph style={appRed} /></dt></li>
            <li className='appTerm'><dl>style attribute on a DOM component does work</dl><dt><StyledParagraph style={appRed} /></dt></li>
          </ul>
          <h2 className='appTopContent'>ReactJS className attribute</h2>
          <p className='appTopContent'>The className attribute applied to DOM elements is the recommended way for styling, applying classes from an external style sheet properly processed by webpack.<br/>
            <a href='https://reactjs.org/docs/dom-elements.html#classname'>https://reactjs.org/docs/dom-elements.html#classname</a>
          </p>
          <ul className='appTopContent'>
            <li className='appTerm'><dl>React components cannot have the classname attribute</dl><dt><UnstyledParagraph className='appRed appTopContent'/></dt></li>
            <li className='appTerm'><dl>DOM components are styled by classname</dl><dt className='appRed'>red text</dt></li>
          </ul>
          <h2 className='appTopContent'>Styling these instructions</h2>
          <ul className='appTopContent'>
            <li>Use unique css class names to apply styles only to instruction elements</li>
            <li>Background
              <ul>
              <li>Add a wrapping div providing background</li>
              <li>The wrapping div automatically takes up the full width of body</li>
              <li>Set left and right margin, since header tags do not have that</li>
              <li>Add a top and bottom child div, so that the wrapping also includes top and bottom margins</li>
            </ul></li>
          </ul>
        </div>
        <div className='appTopBottom' />
      </div>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    </Fragment>
  }
}
