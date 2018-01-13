import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

export default class MediaEmbed extends Component {
    static propTypes = {
        innerHTML: PropTypes.string.isRequired,
    }

    render() {
        return (
            <Container
                dangerouslySetInnerHTML={{ __html: this.props.innerHTML }}
            />
        )
    }
}

const Container = styled.div`
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    position: relative;
    cursor: pointer;
    background-color: ${props => props.theme.colors.black};

    & > iframe {
        position: absolute;
        ${'' /*
        single-track soundcloud embeds are 100% width/height.
        but artist-player soundcloud embeds are 500px width/height.
        override this to standardize and enable responsive hack.
        */} width: 100%;
        height: 100%;
    }
`



// WEBPACK FOOTER //
// ./app/features/posts/MediaEmbed/components/IframeWrapper/index.js