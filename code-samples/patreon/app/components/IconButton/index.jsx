import t from 'prop-types'
import React from 'react'
import Icon from 'components/Icon'

const COLORS = [
    'highlightPrimary',
    'gray1',
    'gray2',
    'gray3',
    'gray4',
    'gray5',
    'gray6',
    'gray7',
    'gray8',
]
const HOVER_COLORS = [
    'facebookBlue',
    'twitterBlue',
    'youtubeRed',
    'twitchPurple',
    ...COLORS,
]
const SIZES = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl']

export default class IconButton extends React.Component {
    static propTypes = {
        /**
        * Color of Icon to display
        */
        color: t.oneOf(COLORS).isRequired,

        'data-tag': t.string,
        /**
         * `facebookBlue` `twitterBlue` `youtubeRed` `twitchPurple`
         */
        hoverColor: t.oneOf(HOVER_COLORS),

        /**
        * URL should link when clicked
        */
        href: t.string,

        /**
         * Callback function for when button is clicked.
         */
        onClick: t.func,

        /**
        * `xs` `sm` `md` `lg` `xl`
        */
        size: t.oneOf(SIZES).isRequired,

        /**
         * Provide the `target` for your anchor.
         */
        target: t.string,

        /**
        * Type of Icon to display (i.e. 'socialRoundedFacebook')
        */
        type: t.string.isRequired,
    }

    state = {
        hover: false,
    }

    _onHover = () => {
        this.setState({ hover: true })
    }

    _onHoverLeave = () => {
        this.setState({ hover: false })
    }

    render() {
        const {
            href,
            target,
            onClick,
            type,
            size,
            hoverColor,
            color,
        } = this.props

        const _icon = (
            <Icon
                type={type}
                size={size}
                color={(this.state.hover && hoverColor) || color}
            />
        )

        if (!href) {
            return (
                <button
                    className="button-reset"
                    data-tag={this.props['data-tag']}
                    onClick={onClick}
                    onMouseOver={this._onHover}
                    onMouseLeave={this._onHoverLeave}
                >
                    {_icon}
                </button>
            )
        }

        return (
            <a
                data-tag={this.props['data-tag']}
                href={href}
                target={target}
                onClick={onClick}
                onMouseOver={this._onHover}
                onMouseLeave={this._onHoverLeave}
            >
                {_icon}
            </a>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/IconButton/index.jsx