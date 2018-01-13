/* eslint-disable react/no-string-refs */

import PropTypes from 'prop-types'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Motion, spring } from 'react-motion'
import { withProps } from 'recompose'

import shallowCompare from 'utilities/shallow-compare'

import Block from 'components/Layout/Block'
import Card from 'components/Card'
import PseudoEffects from 'components/PseudoEffects'
import Text from 'components/Text'
import DEFAULT_SPRING from 'constants/motion.js'
import devWarn from 'utilities/dev-warn'

import {
    CardWrapper,
    List,
    BarContainer,
    Bar,
    Item,
    ItemAnchor,
    ItemLink,
    ItemLabelContainer,
} from './styled-components'

class HorizontalNavList extends Component {
    state = {
        barPosX: -1,
        barWidth: 16,
    }

    static propTypes = {
        /**
         * `left` `center` `right`
         */
        align: PropTypes.oneOf(['left', 'center', 'right']),

        /**
         * [barPadding description]
         */
        barPadding: PropTypes.bool,

        /**
         * Disable all items.
         */
        disabled: PropTypes.bool,
        /**
         * [fullWidthItems description]
         */
        fullWidthItems: PropTypes.bool,
        /**
         * [includeBarBackdrop description]
         */
        includeBarBackdrop: PropTypes.bool,

        /**
         * Wraps the list in a `Card` component.
         */
        card: PropTypes.bool,

        /**
         * `highlightPrimary` `highlightSecondary` `gray1`
         */
        color: PropTypes.oneOf([
            'highlightPrimary',
            'highlightSecondary',
            'gray1',

            // @DEPRECATED
            'orange',
            'blue',
            'dark',
        ]),

        /**
         * example: `[{label: 'Item1', isActive: true}, {label: 'Item2'}]`
         */
        items: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.node.isRequired,
                isActive: PropTypes.bool,
                href: PropTypes.string,
                to: PropTypes.string,
            }),
        ).isRequired,

        /**
         * `sm` `md`
         */
        size: PropTypes.oneOf(['xs', 'sm', 'md']),
    }

    static defaultProps = {
        align: 'center',
        size: 'md',
        color: 'highlightSecondary',
        barPadding: false,
        fullWidthItems: false,
        includeBarBackdrop: false,
    }

    shouldComponentUpdate = shallowCompare

    _warnDeprecatedColor = color => {
        devWarn(
            `Warning: the color "${color}" is deprecated for <HorizontalNavList>.`,
        )
    }

    _mapDeprecatedColors = color => {
        switch (color) {
            case 'orange':
                return 'highlightPrimary'
            case 'blue':
                return 'highlightSecondary'
            case 'dark':
                return 'gray1'
            default:
                return color
        }
    }

    _setBarState = () => {
        if (!this.activeRef) {
            //If no active ref, no tab is selected. Set to default of -1.
            this.setState({
                barPosX: -1,
            })
            return
        }

        const root = ReactDOM.findDOMNode(this)
        const rootRect = root.getBoundingClientRect()
        const active = this.activeRef
        const rect = active.getBoundingClientRect()
        const posX = rect.left - rootRect.left

        if (this.state.barPosX > -1 && this.state.barPosX === posX) return
        this.setState({
            barPosX: posX,
            barWidth: rect.width,
        })
    }

    componentDidMount() {
        this._setBarState()
        if (['orange', 'blue', 'dark'].includes(this.props.color)) {
            this._warnDeprecatedColor(this.props.color)
        }
    }

    componentDidUpdate() {
        this._setBarState()
    }

    renderItem = ({ href, isActive, label, onClick, to }, i) => {
        const { align, disabled, fullWidthItems, size } = this.props

        const color = this._mapDeprecatedColors(this.props.color)

        const itemProps = {
            align,
            fullWidthItems,
            isActive: isActive,
            size,
        }

        const labelPadding = {
            xs: 1,
            sm: 2,
            md: 3,
        }

        // use a react-router <Link> element if we have a `to` prop, otherwise use an <a>
        const NavEl = to
            ? withProps({ ...itemProps, disabled, to, onClick })(ItemLink)
            : withProps({ ...itemProps, href, disabled, onClick })(ItemAnchor)

        return (
            <Item {...itemProps} key={i}>
                <NavEl>
                    <div
                        ref={ref => (isActive ? (this.activeRef = ref) : null)}
                    >
                        <Block pv={labelPadding[size]}>
                            <ItemLabelContainer {...itemProps}>
                                <PseudoEffects hoverProps={{ color: color }}>
                                    <Text
                                        weight="bold"
                                        color={isActive ? color : 'gray3'}
                                    >
                                        {label}
                                    </Text>
                                </PseudoEffects>
                            </ItemLabelContainer>
                        </Block>
                    </div>
                </NavEl>
            </Item>
        )
    }

    renderBar = () => {
        const { includeBarBackdrop, size } = this.props

        const color = this._mapDeprecatedColors(this.props.color)

        const barContainerProps = {
            includeBarBackdrop,
            size,
        }

        const barProps = {
            color,
            size,
        }

        if (this.state.barPosX < 0) {
            return includeBarBackdrop ? (
                <BarContainer {...barContainerProps} />
            ) : null
        }
        const motionStyle = {
            width: spring(this.state.barWidth, DEFAULT_SPRING),
            left: spring(this.state.barPosX, DEFAULT_SPRING),
        }

        return (
            <BarContainer {...barContainerProps}>
                <Motion style={motionStyle}>
                    {xs => {
                        const barStyles = {
                            width: xs.width,
                            WebkitTransform: `translateX(${xs.left}px)`,
                            transform: `translateX(${xs.left}px)`,
                        }

                        return <Bar {...barProps} style={barStyles} />
                    }}
                </Motion>
            </BarContainer>
        )
    }

    render() {
        const { align, card, barPadding, disabled, items } = this.props

        const listProps = {
            align,
            barPadding,
            disabled,
        }

        const listEl = (
            <div style={{ position: 'relative' }}>
                <List {...listProps}>{items.map(this.renderItem)}</List>

                {this.renderBar()}
            </div>
        )

        return card ? (
            <CardWrapper disabled={disabled}>
                <Card noPadding>{listEl}</Card>
            </CardWrapper>
        ) : (
            listEl
        )
    }
}

export default HorizontalNavList



// WEBPACK FOOTER //
// ./app/components/HorizontalNavList/index.jsx