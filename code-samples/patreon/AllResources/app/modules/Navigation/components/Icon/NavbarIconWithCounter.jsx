import t from 'prop-types'
import React, { Component } from 'react'

import Badge from 'components/Badge'

import NavbarIcon from './NavbarIcon'

class NavbarIconWithCounter extends Component {
    static propTypes = {
        color: t.oneOf(['highlightPrimary', 'gray1', 'white']),
        counter: t.number,
        height: t.string,
        hoverColor: t.string,
        width: t.string,
        type: t.string,
    }

    render() {
        const iconProps = {
            color: this.props.color,
            height: this.props.height,
            hoverColor: this.props.hoverColor,
            width: this.props.width,
            type: this.props.type,
        }

        return (
            <Badge
                bgColor="highlightPrimary"
                hideIfZero
                target={<NavbarIcon {...iconProps} />}
            >
                {this.props.counter}
            </Badge>
        )
    }
}

export default NavbarIconWithCounter



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/Icon/NavbarIconWithCounter.jsx