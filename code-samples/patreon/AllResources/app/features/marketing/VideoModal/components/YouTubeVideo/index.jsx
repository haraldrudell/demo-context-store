import t from 'prop-types'
import React from 'react'

import { Iframe } from './styled-components'

const YouTubeVideo = ({ videoId }) => (
    <Iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${window.location}`}
        frameBorder="0"
        allowFullScreen
    />
)
YouTubeVideo.propTypes = {
    videoId: t.string.isRequired,
}

export default YouTubeVideo



// WEBPACK FOOTER //
// ./app/features/marketing/VideoModal/components/YouTubeVideo/index.jsx