import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withState } from 'recompose'

import Block from 'components/Layout/Block'
import Col from 'components/Layout/Col'
import Grid from 'components/Layout/Grid'
import Row from 'components/Layout/Row'

import { HeaderVideoWrapper } from './styled-components'

@withState('videoIsLoaded', 'setVideoIsLoaded', false)
class BannerWithVideo extends Component {
    static propTypes = {
        children: PropTypes.node,
        fallbackImageUrl: PropTypes.string,
        // Whether to show video or only use fallback url
        showVideo: PropTypes.bool,
        videoIsPlaying: PropTypes.bool,
        videoSources: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.string,
                url: PropTypes.string,
            }),
        ),
        videoIsLoaded: PropTypes.bool,
        setVideoIsLoaded: PropTypes.func,
    }

    static defaultProps = {
        showVideo: true,
        videoIsPlaying: true,
    }

    componentDidMount() {
        if (this.video) {
            this.video.onloadeddata = this.onVideoLoad
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.video && nextProps.showVideo) {
            const { videoIsPlaying } = this.props

            if (videoIsPlaying && !nextProps.videoIsPlaying) {
                this.video.pause()
            } else if (!videoIsPlaying && nextProps.videoIsPlaying) {
                this.video.play()
            }
        }
    }

    onVideoLoad = () => {
        this.props.setVideoIsLoaded(true)
    }

    renderSource = source =>
        <source key={source.type} src={source.url} type={source.type} />

    render() {
        const {
            children,
            fallbackImageUrl,
            showVideo,
            videoIsLoaded,
            videoSources,
        } = this.props

        let fallbackImageSrcSet = undefined
        if (!videoIsLoaded && fallbackImageUrl) {
            const retinaSrc = fallbackImageUrl.replace(/(\.[^\.]+)$/i, '@2x$1')
            fallbackImageSrcSet = {
                1: `url(${fallbackImageUrl})`,
                2: `url(${retinaSrc})`,
            }
        }

        return (
            <Block position="relative">
                <HeaderVideoWrapper fallbackImageSrcSet={fallbackImageSrcSet}>
                    {showVideo &&
                        <video
                            autoPlay
                            loop
                            muted
                            ref={video => (this.video = video)}
                            style={{
                                height: '100%',
                                objectFit: 'cover',
                                width: '100%',
                            }}
                        >
                            {videoSources.map(this.renderSource)}
                        </video>}
                </HeaderVideoWrapper>
                <Grid
                    ph={{ xs: 2 }}
                    pv={{ xs: 4, sm: 12, md: 20 }}
                    maxWidth="md"
                >
                    <Row>
                        <Col xs={12}>
                            {children}
                        </Col>
                    </Row>
                </Grid>
            </Block>
        )
    }
}

export default BannerWithVideo



// WEBPACK FOOTER //
// ./app/features/marketing/BannerWithVideo/index.jsx