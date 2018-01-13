import t from 'prop-types'
import React from 'react'
import keyCodes from 'constants/key-codes'

const HANDLED_KEYCODES = [keyCodes.ENTER, keyCodes.UP, keyCodes.DOWN]

export default class extends React.Component {
    static propTypes = {
        children: t.node,
        isActive: t.bool,
        items: t.array,
        onClick: t.func,
    }

    static defaultProps = {
        isActive: false,
        items: [],
        onClick: () => {},
    }

    state = {
        currentIndex: -1,
    }

    componentDidMount() {
        document && document.addEventListener('keydown', this.handleKeyDown)
    }

    componentWillUnmount() {
        document && document.removeEventListener('keydown', this.handleKeyDown)
    }

    handleKeyDown = e => {
        if (!this.props.isActive || !HANDLED_KEYCODES.includes(e.keyCode)) {
            return
        }

        let index
        let itemsLength = this.props.items.length

        e.preventDefault()

        switch (e.keyCode) {
            case keyCodes.ENTER:
                const item = this.props.items[this.state.currentIndex]
                if (item) this.props.onClick(item, this.state.currentIndex)
                break
            case keyCodes.UP:
                index = this.state.currentIndex - 1
                if (index < 0) index = itemsLength - 1
                this.setState({ currentIndex: index })
                break
            case keyCodes.DOWN:
                index = this.state.currentIndex + 1
                if (index > itemsLength - 1) index = 0
                this.setState({ currentIndex: index })
                break
        }
    }

    render() {
        const items = this.props.items.map((item, i) => {
            if (i !== this.state.currentIndex) return item

            return { ...item, isHighlighted: true }
        })

        return React.cloneElement(this.props.children, { items })
    }
}



// WEBPACK FOOTER //
// ./app/components/InteractiveList/KeyboardNav.js