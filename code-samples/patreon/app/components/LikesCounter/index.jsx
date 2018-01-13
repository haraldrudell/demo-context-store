/* eslint-disable react/prop-types */

import PropTypes from 'prop-types'

import React from 'react'
import shallowCompare from 'utilities/shallow-compare'
import Icon from 'components/Icon'

export default class LikesCounter extends React.Component {
    state = {
        optimisticLikeInfo: null,
    }

    shouldComponentUpdate = shallowCompare

    static propTypes = {
        currentUserHasLiked: PropTypes.bool,
        likeCount: PropTypes.number,
        onLikeClick: PropTypes.func.isRequired,
        loading: PropTypes.bool,
        size: PropTypes.string,
    }

    static defaultProps = {
        likeCount: 0,
        loading: false,
        size: 'xs',
    }

    handleLikeClick = () => {
        if (this.props.loading) {
            return
        }

        this.props.onLikeClick()
        if (this.isOptimisticallyUpdating()) {
            this.toggleLikes()
        } else {
            this.startOptimism().then(this.toggleLikes)
        }
    }

    isOptimisticallyUpdating = () => {
        return this.state.optimisticLikeInfo !== null
    }

    startOptimism = () => {
        const { currentUserHasLiked, likeCount } = this.props
        return new Promise(success => {
            this.setState(
                {
                    optimisticLikeInfo: { currentUserHasLiked, likeCount },
                },
                success,
            )
        })
    }

    toggleLikes = () => {
        const { currentUserHasLiked, likeCount } = this.state.optimisticLikeInfo
        const newLikedState = !currentUserHasLiked
        const newLikeCount = likeCount + (newLikedState ? 1 : -1)
        this.setState({
            optimisticLikeInfo: {
                currentUserHasLiked: newLikedState,
                likeCount: newLikeCount,
            },
        })
    }

    getLikeInfo = () => {
        if (this.isOptimisticallyUpdating()) {
            return this.state.optimisticLikeInfo
        }
        return this.props
    }

    render() {
        const { size } = this.props
        const { currentUserHasLiked, likeCount } = this.getLikeInfo()
        const color = currentUserHasLiked ? 'highlightPrimary' : 'gray3'
        const label = likeCount !== 0 ? `${likeCount}` : ''

        return (
            <Icon
                type="heartSolid"
                color={color}
                label={label}
                labelBold
                size={size}
                onClick={this.handleLikeClick}
            />
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/LikesCounter/index.jsx