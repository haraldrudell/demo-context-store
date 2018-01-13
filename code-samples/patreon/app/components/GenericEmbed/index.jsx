import t from 'prop-types'
import React, { Component } from 'react'
import shallowCompare from 'utilities/shallow-compare'

import Block from 'components/Layout/Block'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import Text from 'components/Text'

import { ImgContainer, EmbedDetails } from './styled-components'

export default class GenericEmbed extends Component {
    shouldComponentUpdate = shallowCompare

    static propTypes = {
        description: t.string,
        domain: t.string,
        imageEl: t.element,
        imageSrc: t.string,
        isGridOptionSelected: t.bool,
        subject: t.string,
        url: t.string.isRequired,
    }

    renderEmbedImage() {
        const { imageSrc, imageEl } = this.props

        return imageSrc && !imageEl
            ? <ImgContainer>
                  <img src={imageSrc} />
              </ImgContainer>
            : imageEl || null
    }

    renderGridEmbed = () => {
        const embedImage = this.renderEmbedImage()

        return (
            <Block fluidWidth fluidHeight backgroundColor="gray5">
                <Flexy
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    fluidHeight
                >
                    {embedImage
                        ? embedImage
                        : <Icon type="link" size="xxl" color="gray4" />}
                </Flexy>
            </Block>
        )
    }

    renderGenericEmbed = () => {
        const { url, subject, description, domain } = this.props

        return (
            <Block b noOverflow>
                <a href={url} target="_blank" style={{ color: 'inherit' }}>
                    {this.renderEmbedImage()}
                    <EmbedDetails>
                        {subject
                            ? <Text weight="bold">
                                  {subject}
                              </Text>
                            : null}
                        {description &&
                            <Text size={0}>
                                {description}
                            </Text>}
                        {domain
                            ? <Text color="gray3" size={0}>
                                  {domain}
                              </Text>
                            : null}
                    </EmbedDetails>
                </a>
            </Block>
        )
    }

    render() {
        return this.props.isGridOptionSelected
            ? this.renderGridEmbed()
            : this.renderGenericEmbed()
    }
}



// WEBPACK FOOTER //
// ./app/components/GenericEmbed/index.jsx