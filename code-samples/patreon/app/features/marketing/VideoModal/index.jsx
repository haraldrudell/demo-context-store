import t from 'prop-types'
import React from 'react'

import NewModal from 'components/NewModal'

import SelfHostedVideo from './components/SelfHostedVideo'
import YouTubeVideo from './components/YouTubeVideo'

const VideoModal = ({ isOpen, onClose, videoSources, youtubeVideoId }) => (
    <NewModal
        isOpen={isOpen}
        onRequestClose={onClose}
        width="xl"
        ignoreTopOffset
    >
        {/* Sadly, controlsList only works in React 15.6 */}
        {youtubeVideoId ? (
            <YouTubeVideo videoId={youtubeVideoId} />
        ) : (
            <SelfHostedVideo videoSources={videoSources} />
        )}
    </NewModal>
)

VideoModal.propTypes = {
    isOpen: t.bool,
    onClose: t.func,
    videoSources: t.arrayOf(
        t.shape({
            type: t.oneOf(['video/mp4', 'video/webm; codecs=vp8,vorbis']),
            url: t.string,
        }),
    ),
    youtubeVideoId: t.string,
}

export default VideoModal



// WEBPACK FOOTER //
// ./app/features/marketing/VideoModal/index.jsx