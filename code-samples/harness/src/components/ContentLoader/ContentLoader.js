//
/* Some parts of this code belongs to
https://github.com/danilowoz/react-content-loader, Copyright (c) 2015 Julian Ćwirko <julian.io> (MIT)*/
//
import React from 'react'
import uuid from 'uuid'

const Wrap = props => {
  const idClip = uuid.v1()
  const idGradient = uuid.v1()

  //
  // Dev note: width, height, and preserveAspectRatio need to be set properly
  // to prevent stretching/scaling (when parent container changes its dimmension)
  //
  return (
    <svg
      width="100%"
      height={`${props.height}`}
      viewBox={`0 0 ${props.width} ${props.height}`}
      version="1.1"
      style={props.style}
      preserveAspectRatio="none slice"
    >
      <rect
        style={{ fill: `url(#${idGradient})` }}
        clipPath={`url(#${idClip})`}
        x="0"
        y="0"
        width={props.width}
        height={props.height}
      />

      <defs>
        <clipPath id={`${idClip}`}>
          {props.children}
        </clipPath>

        <linearGradient id={`${idGradient}`}>
          <stop offset="0%" stopColor={props.primaryColor}>
            <animate attributeName="offset" values="-2; 1" dur={`${props.speed}s`} repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor={props.secondaryColor}>
            <animate attributeName="offset" values="-1.5; 1.5" dur={`${props.speed}s`} repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor={props.primaryColor}>
            <animate attributeName="offset" values="-1; 2" dur={`${props.speed}s`} repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  )
}

export default class ContentLoader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      style: props.style,
      speed: props.speed,
      width: props.width,
      height: props.height,
      primaryColor: props.primaryColor,
      secondaryColor: props.secondaryColor
    }
  }

  render () {
    return (
      <Wrap {...this.state}>
        {this.props.children}
      </Wrap>
    )
  }

  static ListStyle = ({ height = 220 }) =>
    <ContentLoader height={height}>
      <rect x="0" y="0" rx="0" ry="0" width="250" height="10" />
      <rect x="20" y="20" rx="0" ry="0" width="220" height="10" />
      <rect x="20" y="40" rx="0" ry="0" width="170" height="10" />
      <rect x="0" y="60" rx="0" ry="0" width="250" height="10" />
      <rect x="20" y="80" rx="0" ry="0" width="200" height="10" />
      <rect x="20" y="100" rx="0" ry="0" width="80" height="10" />
    </ContentLoader>

  static InfoStyle = ({ height = 220 }) =>
    <ContentLoader height={height}>
      <rect x="0" y="13" rx="0" ry="0" width="100" height="13" />
      <rect x="0" y="37" rx="0" ry="0" width="50" height="8" />
      <rect x="0" y="60" rx="0" ry="0" width="400" height="150" />
    </ContentLoader>
}

ContentLoader.defaultProps = {
  speed: 2,
  width: 400,
  height: 130,
  primaryColor: '#eee',
  secondaryColor: '#e1e4e5'
}



// WEBPACK FOOTER //
// ../src/components/ContentLoader/ContentLoader.js