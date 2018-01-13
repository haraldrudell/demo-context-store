import t from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import forIn from 'lodash/forIn'
import inViewport from 'in-viewport'

import exists from 'utilities/exists'
import numberToPercent from 'utilities/number-to-percent'
import secondsToMinutes from 'utilities/seconds-to-minutes'
import { IS_IOS } from 'utilities/browser'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import LoadingSpinner from 'components/LoadingSpinner'
import Text from 'components/Text'

import {
    AudioPlayerContainer,
    FloatRight,
    MainActionButton,
    PlayerControlButtons,
    SkipSecondsButton,
    TimelineBar,
    TimelineBackground,
    TimelineForeground,
    SquareImageBackground,
    SquareThumbnailContainer,
    SquareThumbnailImage,
    StackedImageBackground,
    StackedThumbnailContainer,
    StackedThumbnailImage,
    StackedThumbnailImageElement,
    WideImageBackground,
    WideThumbnailContainer,
} from './styled-components'

//Player style varients
export const VARIANT_DEFAULT = 'VARIANT_DEFAULT'
export const VARIANT_STACKED = 'VARIANT_STACKED'
export const VARIANT_WIDE = 'VARIANT_WIDE'
export const VARIANT_SQUARE = 'VARIANT_SQUARE'

//Player states
const NOT_PLAYING = 'notPlaying'
const PLAYING = 'playing'
const INITIAL_LOADING = 'initialLoading'
const LOADING = 'loading'
const FAILED = 'failed'
const EVENT_LISTENER_REFS = {
    ended: 'onEnded',
    playing: 'onPlaying',
    timeupdate: 'onTimeupdate',
    pause: 'onPause',
    seeked: 'onSeeked',
    error: 'onError',
    loadedmetadata: 'onLoadedMetaData',
    stalled: 'onStalled',
}

const SKIP_SECONDS_INCRMENET = 15

const getFileType = src => {
    if (!src) {
        return undefined
    }
    const fileType = src.split('.').pop()
    return `audio/${fileType}`
}

export default class AudioPlayer extends Component {
    static propTypes = {
        src: t.string,
        thumbnail: t.string,
        type: t.string,
        variant: t.oneOf([
            VARIANT_DEFAULT,
            VARIANT_STACKED,
            VARIANT_WIDE,
            VARIANT_SQUARE,
        ]),
    }

    static defaultProps = {
        variant: VARIANT_DEFAULT,
    }

    constructor(props) {
        super(props)
        this.state = {
            currentTimeSeconds: 0,
            durationSeconds: 0,
            durationMinutes: '0:00',
            displayStatus: INITIAL_LOADING,
            hasClickedPlay: false,
        }
    }

    componentDidMount() {
        this.setEventListeners(true)
        const { audioElement } = this
        inViewport(ReactDOM.findDOMNode(this), { offset: 200 }, () => {
            audioElement.load()
        })
    }

    componentWillUnmount() {
        this.setEventListeners(false)
    }

    onMainButtonClick = () => {
        const displayStatus = this.state.displayStatus
        const audioElement = this.audioElement
        let newDisplayStatus = displayStatus

        if (displayStatus === INITIAL_LOADING) {
            return
        } else if (audioElement.seeking && displayStatus === LOADING) {
            audioElement.pause()
            newDisplayStatus = NOT_PLAYING
        } else if (audioElement.seeking && displayStatus === NOT_PLAYING) {
            audioElement.play()
            newDisplayStatus = LOADING
        } else if (displayStatus === NOT_PLAYING) {
            audioElement.play()
        } else if (displayStatus === PLAYING) {
            audioElement.pause()
        } else if (displayStatus === FAILED) {
            audioElement.src = this.props.src
            audioElement.load()
            newDisplayStatus = LOADING
        }

        this.setState({
            displayStatus: newDisplayStatus,
        })
    }

    seekAudio = e => {
        let clickTargetLength =
            e.clientX - this.getLeftOffsetOfTarget(e.currentTarget)
        if (clickTargetLength < 16) {
            // if user is tapping very close to the beginning of the track, they want
            // to start from the beginning.
            clickTargetLength = 0
            // edge case: if user has never played and new target time is also 0,
            // don't send them to the loading state (will never break out)
            if (this.state.currentTimeSeconds === 0) {
                return
            }
        }
        const timelineLength = e.currentTarget.offsetWidth
        const targetDecimal = clickTargetLength
            ? clickTargetLength / timelineLength
            : 0
        const targetSeconds = targetDecimal * this.state.durationSeconds
        const audioElement = this.audioElement
        audioElement.currentTime = targetSeconds
        this.setState({
            displayStatus: LOADING,
            currentTimeSeconds: audioElement.currentTime,
        })
    }

    incrementAudio = seconds => {
        const targetSeconds = this.state.currentTimeSeconds + seconds
        const audioElement = this.audioElement
        audioElement.currentTime = targetSeconds
        this.setState({
            displayStatus: LOADING,
            currentTimeSeconds: audioElement.currentTime,
        })
    }

    onLoadedMetaData = e => {
        const durationSeconds = this.audioElement.duration
        this.setState({
            displayStatus: NOT_PLAYING,
            durationSeconds,
        })
    }

    /* When there are too many parallel active connections,
     * <audio> will stall due to browser restrictions.
     * We want to automatically retry the audio download when that happens.
     * https://stackoverflow.com/questions/985431/max-parallel-http-connections-in-a-browser/985704#985704
     */
    onStalled = e => {
        /* Mobile view will not have that many audio elements trying to load at once
       * so the hack to reload elements only applies to > mobile size
       * Reloading mobile elements when stalling could be an issue with network latency
       * instead of active connections actually causes unpredictable results
       */
        if (!IS_IOS) {
            this.audioElement.load()
        }
    }

    onPlaying = () => {
        this.setState({
            displayStatus: PLAYING,
            hasClickedPlay: true,
        })
    }

    onPause = () => {
        this.setState({ displayStatus: NOT_PLAYING })
    }

    onEnded = () => {
        this.setState({ displayStatus: NOT_PLAYING })
    }

    onSeeked = e => {
        const displayStatus = e.target.paused ? NOT_PLAYING : PLAYING
        this.setState({ displayStatus })
    }

    onError = () => {
        // Event support for buffer overruns doesn't seem consistent – this
        // only reliably fires in Chrome if connection is lost.
        this.setState({ displayStatus: FAILED })
    }

    onTimeupdate = e => {
        this.setState({ currentTimeSeconds: e.target.currentTime })
    }

    getLeftOffsetOfTarget = element => {
        let offset = element.offsetLeft
        element = element.offsetParent
        while (element && exists(element.offsetLeft)) {
            offset += element.offsetLeft
            element = element.offsetParent
        }
        return offset
    }

    setEventListeners = addListeners => {
        const audioElement = this.audioElement
        const method = addListeners ? 'addEventListener' : 'removeEventListener'
        forIn(EVENT_LISTENER_REFS, (value, key) => {
            audioElement[method](key, this[value])
        })
    }

    renderAudioElement = () => {
        const { src, type } = this.props

        return (
            <audio
                preload="none"
                src={src}
                type={type || getFileType(src)}
                ref={ref => (this.audioElement = ref)}
            >
                <span>
                    "We couldn't load the audio player! Please try a different
                    browser."
                </span>
            </audio>
        )
    }

    renderTimelineBar = () => {
        const { currentTimeSeconds, durationSeconds } = this.state
        const completedDecimal =
            currentTimeSeconds && durationSeconds
                ? currentTimeSeconds / durationSeconds
                : 0
        const completedPercentage = numberToPercent(completedDecimal)

        return (
            <TimelineBar onClick={this.seekAudio}>
                <TimelineBackground>
                    <TimelineForeground
                        style={{ width: completedPercentage }}
                    />
                </TimelineBackground>
            </TimelineBar>
        )
    }

    renderTimelineCurrentTime = () => {
        const { currentTimeSeconds, hasClickedPlay } = this.state
        const currentTimeMinutes = secondsToMinutes(currentTimeSeconds)

        return (
            <Text color={`${hasClickedPlay ? 'gray2' : 'gray3'}`} weight="bold">
                {currentTimeMinutes}
            </Text>
        )
    }

    renderTimelineDurationMinutes = () => {
        const { durationSeconds } = this.state
        const durationMinutes = secondsToMinutes(durationSeconds)

        return (
            <FloatRight>
                <Text color="gray3" weight="bold">
                    {durationMinutes}
                </Text>
            </FloatRight>
        )
    }

    renderTimeline = variant => {
        const isWide = variant === VARIANT_WIDE

        return (
            <Flexy alignItems="center">
                {this.renderTimelineCurrentTime()}
                <Block mh={isWide ? 2 : 1} pv={isWide ? 2 : 0} fluidWidth>
                    {this.renderTimelineBar()}
                </Block>
                {this.renderTimelineDurationMinutes()}
            </Flexy>
        )
    }

    renderMainActionButton = displayStatus => {
        switch (displayStatus) {
            case NOT_PLAYING:
                return <Icon type="playCircle" size="fluid" color="gray2" />
            case PLAYING:
                return <Icon type="pauseCircle" size="fluid" color="gray2" />
            case INITIAL_LOADING:
                return <LoadingSpinner size="fluid" />
            case LOADING:
                return <LoadingSpinner size="fluid" />
            case FAILED:
                return <Icon type="reload" size="fluid" color="gray2" />
            default:
                //default should never happen
                return <Icon type="pauseCircle" size="fluid" color="gray2" />
        }
    }

    renderPlayerControlButtons = variant => {
        const renderSkipSecondsButton = ({ isBack }) => {
            const increment = isBack
                ? -SKIP_SECONDS_INCRMENET
                : SKIP_SECONDS_INCRMENET
            const iconType = isBack ? 'skipBack' : 'skipForward'
            return (
                <SkipSecondsButton
                    onClick={() => {
                        this.incrementAudio(increment)
                    }}
                >
                    <Icon type={iconType} size="md" color="gray3" />
                </SkipSecondsButton>
            )
        }

        return (
            <PlayerControlButtons variant={variant}>
                {renderSkipSecondsButton({ isBack: true })}
                <Block mh={4}>
                    <MainActionButton onClick={this.onMainButtonClick}>
                        {this.renderMainActionButton(this.state.displayStatus)}
                    </MainActionButton>
                </Block>
                {renderSkipSecondsButton({ isBack: false })}
            </PlayerControlButtons>
        )
    }

    renderWidePlayer = () => {
        const { thumbnail } = this.props
        const variant = VARIANT_WIDE

        return (
            <AudioPlayerContainer variant={variant}>
                <WideThumbnailContainer>
                    <WideImageBackground
                        style={{ backgroundImage: 'url("' + thumbnail + '")' }}
                    />
                </WideThumbnailContainer>
                <Flexy direction="column" flexGrow={1} fluidWidth>
                    {this.renderAudioElement()}
                    {this.renderPlayerControlButtons(variant)}
                    <Block ph={3} pb={0.5} fluidWidth>
                        {this.renderTimeline(variant)}
                    </Block>
                </Flexy>
            </AudioPlayerContainer>
        )
    }

    renderVerticalPlayerControls = variant => {
        return (
            <Flexy direction="column" flexGrow={1}>
                {this.renderAudioElement()}
                <Block mt={2} fluidWidth>
                    {this.renderPlayerControlButtons(variant)}
                </Block>
                <Block ph={3} mv={1} fluidWidth>
                    {this.renderTimeline(variant)}
                </Block>
            </Flexy>
        )
    }

    renderStackedPlayer = () => {
        const { thumbnail } = this.props
        const variant = VARIANT_STACKED

        return (
            <AudioPlayerContainer variant={variant}>
                <StackedThumbnailContainer>
                    <StackedImageBackground
                        style={{ backgroundImage: 'url("' + thumbnail + '")' }}
                    />
                    <StackedThumbnailImage>
                        <StackedThumbnailImageElement src={thumbnail} />
                    </StackedThumbnailImage>
                </StackedThumbnailContainer>
                {this.renderVerticalPlayerControls(variant)}
            </AudioPlayerContainer>
        )
    }

    // VARIANT_SQUARE is used for the Post Grid view
    // It is a variant off VARIANT_STACKED to create an audio player
    // that looks good as a square.
    renderSquarePlayer = () => {
        const { thumbnail } = this.props
        const variant = VARIANT_SQUARE

        return (
            <AudioPlayerContainer variant={variant}>
                <SquareThumbnailContainer>
                    <SquareImageBackground
                        style={{ backgroundImage: 'url("' + thumbnail + '")' }}
                    />
                    <SquareThumbnailImage
                        style={{ backgroundImage: 'url("' + thumbnail + '")' }}
                    />
                </SquareThumbnailContainer>
                {this.renderVerticalPlayerControls(variant)}
            </AudioPlayerContainer>
        )
    }

    render() {
        const { variant } = this.props

        switch (variant) {
            case VARIANT_STACKED:
                return this.renderStackedPlayer()
            case VARIANT_WIDE:
                return this.renderWidePlayer()
            case VARIANT_SQUARE:
                return this.renderSquarePlayer()
            default:
                return (
                    <div>
                        <Block display={{ xs: 'block', sm: 'none' }}>
                            {this.renderStackedPlayer()}
                        </Block>
                        <Block display={{ xs: 'none', sm: 'block' }}>
                            {this.renderWidePlayer()}
                        </Block>
                    </div>
                )
        }
    }
}



// WEBPACK FOOTER //
// ./app/components/AudioPlayer/index.jsx