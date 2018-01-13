import PropTypes from 'prop-types'
import React from 'react'
import Icon from 'components/Icon'
import Popover from 'components/Popover'
import styles from './styles.less'

export default class InfoPopover extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        color: PropTypes.string,
        iconType: PropTypes.string,
        size: PropTypes.string,
        showOnClick: PropTypes.bool,
    }

    static defaultProps = {
        iconType: 'help',
        size: 'xs',
    }

    state = {
        isOpen: false,
    }

    componentDidMount() {
        const { showOnClick } = this.props
        if (showOnClick) {
            document.body.addEventListener('click', this.hidePopover)
        }
    }

    componentWillUnmount() {
        const { showOnClick } = this.props
        if (showOnClick) {
            document.body.removeEventListener('click', this.hidePopover)
        }
    }

    showPopover = () => {
        this.setState({ isOpen: true })
    }

    hidePopover = () => {
        this.setState({ isOpen: false })
    }

    renderBody = () => {
        return <div className={styles.popover}>{this.props.children}</div>
    }

    render() {
        const { iconType, size, color, showOnClick } = this.props
        const { isOpen } = this.state
        let iconProps = {
            type: iconType,
            size: size,
            color: color,
        }

        if (!showOnClick) {
            iconProps = {
                ...iconProps,
                onMouseEnter: this.showPopover,
                onMouseLeave: this.hidePopover,
            }
        }

        if (!!showOnClick) {
            iconProps = {
                ...iconProps,
                onClick: this.showPopover,
            }
        }

        return (
            <Popover body={this.renderBody()} isOpen={isOpen}>
                <Icon {...iconProps} />
            </Popover>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/InfoPopover/index.jsx