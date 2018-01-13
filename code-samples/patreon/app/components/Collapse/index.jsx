/**
 * Taken and modified from https://www.npmjs.com/package/react-collapse
 * Checkout ./readme.md
 */
import PropTypes from 'prop-types'

import React from 'react'
import { Motion, spring } from 'react-motion'
import styled from 'styled-components'
import HeightReporter from './HeightReporter'
import Color from 'color'

const COLORS = ['white']

class Collapse extends React.Component {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired,
        collapsedHeight: PropTypes.number,
        fadeOutBottom: PropTypes.bool,
        backgroundColor: PropTypes.oneOf(COLORS),
        style: PropTypes.object,
        spring: PropTypes.array,
    }

    static defaultProps = {
        collapsedHeight: 0,
        style: {},
        fadeOutBottom: false,
        spring: [300, 30],
    }

    state = { height: 0, dirty: true }

    componentWillMount() {
        this.height = this.props.collapsedHeight
    }

    componentWillReceiveProps({ children }) {
        if (children !== this.props.children) {
            this.setState({ dirty: true })
        }
    }

    onUpdate = () => {
        this.setState({ dirty: true })
    }

    onHeightReady = height => {
        this.setState({ height, dirty: false })
    }

    renderHeightReporter = () => {
        if (!this.state.dirty && this.state.height) {
            // for now, don't return null -- it was causing some measurement
            // problems, and it seems to me that, as long as it's not getting
            // triggered every click of an animation, if we're going to go
            // to the trouble of re-rendering the component, it's not that
            // outrageous to re-render the height reporter as well to get
            // an accurate measurement?
        }
        return (
            <HeightReporter
                onHeightReady={this.onHeightReady}
                {...this.props}
            />
        )
    }

    render() {
        const { isOpened, style, children } = this.props
        const { height } = this.state
        const gradient = this.props.fadeOutBottom
            ? <Gradient backgroundColor={this.props.backgroundColor} />
            : null

        return (
            <div style={{ position: 'relative' }}>
                {this.renderHeightReporter()}

                <Motion
                    defaultStyle={{ height: 0 }}
                    style={{
                        height: spring(
                            isOpened ? height : this.props.collapsedHeight,
                            this.props.spring,
                        ),
                    }}
                >
                    {st => {
                        this.height = parseFloat(st.height).toFixed(2)

                        if (!isOpened && !st.height) {
                            return null
                        }

                        const newStyle =
                            this.height !== parseFloat(height).toFixed(2)
                                ? {
                                      height: st.height,
                                      overflow: 'hidden',
                                  }
                                : { height: 'auto' }

                        return (
                            <div style={{ position: 'relative' }}>
                                {gradient}
                                <div style={{ ...style, ...newStyle }}>
                                    {children}
                                </div>
                            </div>
                        )
                    }}
                </Motion>
            </div>
        )
    }
}

const Gradient = styled.div`
    position: absolute;
    bottom: 0;
    height: ${props => props.theme.units.getValue(10)};
    width: 100%;
    ${props => `
        background-image: linear-gradient(to bottom, ${Color(
            props.theme.colors[props.backgroundColor],
        )
            .alpha(0)
            .string()} 0%, ${props.theme.colors[props.backgroundColor]} 100%);
    `};
`

export default Collapse



// WEBPACK FOOTER //
// ./app/components/Collapse/index.jsx