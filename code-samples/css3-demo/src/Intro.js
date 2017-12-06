import React, {Component, Fragment} from 'react'
import styles from './Intro.css'

if (!Object.keys(styles).length) throw new Error(`Intro.css: missing local styles`)

const appRed = {
  color: 'red',
}
const UnstyledParagraph = () => <span>This text is not red.</span>
const StyledParagraph = () => <span style={appRed}>Sub-component</span>

export default class Intro extends Component {
  render() {
    return <Fragment>
      <Heading>Project: CSS3 Demo</Heading>
      <Sections>
        <SectionHeading>Project Specifics</SectionHeading>
        <TermList>
          <Fragment>Repository</Fragment><Fragment>gt:sw code-samples/css3-demo</Fragment>
          <Fragment>React version</Fragment><Fragment>{React.version}</Fragment>
        </TermList>
        <SectionHeading>Conclusions</SectionHeading>
        <Bullets>
          <Bullet>Apply styles to DOM elements using the className attribute</Bullet>
          <Bullet>Import styles in each React component from a component-specific style sheet</Bullet>
        </Bullets>
        <SectionHeading>CSS Modules</SectionHeading>
        <SectionHeading>ReactJS Styling Options</SectionHeading>
        <TermList>
          <Fragment>Regular style sheet</Fragment><Fragment>Like Create React App src/App.css</Fragment>
          <Fragment>Inline styling</Fragment><Fragment>Use of the style attributed as primary means for styling is not recommended.</Fragment>
          <Fragment>CSS Modules</Fragment><Fragment>The preferred way.</Fragment>
          <Fragment>Styled components</Fragment><Fragment>An npm module styled-components using ECMAScript template strings: bad.</Fragment>
        </TermList>
        <p className='appTopContent'><a href='https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822'>https://codeburst.io/4-four-ways-to-style-react-components-ac6f323da822</a></p>
        <SectionHeading>Create React App  styling</SectionHeading>
        <TermList>
          <Fragment>src/index.css</Fragment><Fragment>Removes margin and padding from body, sets font to sans-serif</Fragment>
          <Fragment>src/App.css</Fragment><Fragment>Some class names prefixed with App</Fragment>
        </TermList>
        <SectionHeading>ReactJS inline styles</SectionHeading>
        <p>Inline styles are not recommended as the primary means of styling since they are not autoprefixed. An external style sheet and the classNames attribute should be used.<br />
          <a href='https://reactjs.org/docs/dom-elements.html#style'>https://reactjs.org/docs/dom-elements.html#style</a>
        </p>
        <TermList>
          <Fragment>style attribute</Fragment><Fragment>DOM Elements can be styled using a style attribute with an ECMAScript object value.</Fragment>
          <Fragment>style attribute on a React component does not work</Fragment><Fragment><UnstyledParagraph style={appRed} /></Fragment>
          <Fragment>style attribute on a DOM component does work</Fragment><Fragment><StyledParagraph style={appRed} /></Fragment>
        </TermList>
        <SectionHeading>ReactJS className attribute</SectionHeading>
        <p>The className attribute applied to DOM elements is the recommended way for styling, applying classes from an external style sheet properly processed by webpack.<br/>
          <a href='https://reactjs.org/docs/dom-elements.html#classname'>https://reactjs.org/docs/dom-elements.html#classname</a>
        </p>
        <TermList>
          <Fragment>React components cannot have the classname attribute</Fragment><Fragment><UnstyledParagraph className={styles.red}/></Fragment>
          <Fragment>DOM components are styled by classname</Fragment><Fragment><span className={styles.red}>red text</span></Fragment>
        </TermList>
        <SectionHeading>Styling these instructions</SectionHeading>
        <Bullets>
          <Bullet>Use unique css class names to apply styles only to instruction elements</Bullet>
          <Bullet>Background
            <Bullets>
              <Bullet>Add a wrapping div providing background</Bullet>
              <Bullet>The wrapping div automatically takes up the full width of body</Bullet>
              <Bullet>Set left and right margin, since header tags do not have that</Bullet>
              <Bullet>Add a top and bottom child div, so that the wrapping also includes top and bottom margins</Bullet>
          </Bullets></Bullet>
        </Bullets>
      </Sections>
    </Fragment>
  }
}

export class Heading extends Component {
  render() {
    const {children} = this.props
    return (
      <h1>{children}</h1>)
  }
}

export class Sections extends Component {
  render() {
    const {children} = this.props
    return (
      <div className={styles.fontSize}>{children}</div>)
  }
}

export class SectionHeading extends Component {
  render() {
    const {children} = this.props
    return (
      <h2>{children}</h2>)
  }
}

export class TermList extends Component {
  render() {
    const {children} = this.props
    return (
      <dl>
        {children.map((term, index) => {
          if (index % 2) return false
          const definition = children[index + 1]
          return <div key={index}>
              <dt className={styles.term}>{term}</dt>
              <dd className={styles.definition}>{definition}</dd>
            </div>
        })}
      </dl>)
  }
}

export class Bullets extends Component {
  render() {
    const {children} = this.props
    return (
      <ul>{children}</ul>)
  }
}

export class Bullet extends Component {
  render() {
    const {children} = this.props
    return (
      <li>{children}</li>)
  }
}
