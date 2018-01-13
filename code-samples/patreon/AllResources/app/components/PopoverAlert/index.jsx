import t from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import Popover from 'components/Popover'
import Text from 'components/Text'
import IconButton from 'components/IconButton'
import Block from 'components/Layout/Block'

import { Z_INDEX_9 } from 'styles/themes/america/z-index'

const PopoverAlert = ({
    body,
    children,
    isOpen,
    minWidth,
    onClose,
    onOuterAction,
    title,
    preferPlace,
    titleLabel,
}) => {
    const renderTitleLabel = (
        <Block display="inline" ph={0.5} mr={1} b>
            <Text color="white" size={0} weight="bold">
                {titleLabel}
            </Text>
        </Block>
    )

    const _body = (
        <Block position="relative" p={2}>
            {title &&
                <Title addMarginRight={!!onClose}>
                    {!!titleLabel && renderTitleLabel}
                    <Text color="white" scale="2" weight="bold">
                        {title}
                    </Text>
                </Title>}
            <Text scale="1" color="white" el="div">
                <BodyWrapper addMarginRight={onClose && !title}>
                    {body}
                </BodyWrapper>
            </Text>
            {onClose &&
                <CloseIconWrapper hasTitle={!!title}>
                    <IconButton
                        type="cancel"
                        color="gray5"
                        size="xxs"
                        onClick={onClose}
                    />
                </CloseIconWrapper>}
        </Block>
    )

    const popoverStyle = {
        minWidth,
        zIndex: Z_INDEX_9,
    }

    return (
        <Popover
            isOpen={isOpen}
            body={_body}
            preferPlace={preferPlace}
            color="secondary"
            style={popoverStyle}
            onOuterAction={onOuterAction}
        >
            {children}
        </Popover>
    )
}

PopoverAlert.propTypes = {
    body: t.node.isRequired,
    children: t.node.isRequired,
    isOpen: t.bool,
    minWidth: t.string,
    onClose: t.func,
    onOuterAction: t.func,
    preferPlace: t.string,
    titleLabel: t.string,
    title: t.node,
}

PopoverAlert.defaultProps = {
    minWidth: '341px',
}

const Title = styled.div`
    letter-spacing: .5;
    margin-top: -4px;
    display: flex;
    align-items: center;
    ${props => (props.addMarginRight ? 'margin-right: 25px;' : '')};
`

const BodyWrapper = styled.div`
    letter-spacing: .5;
    ${props => (props.addMarginRight ? 'margin-right: 25px;' : '')};
`

const CloseIconWrapper = styled.div`
    position: absolute;
    top: ${props => (props.hasTitle ? '20px' : '22px')};
    right: 16px;
    line-height: 0;

    opacity: .5;
    &:hover {
        opacity: 1;
    }
`

export default PopoverAlert



// WEBPACK FOOTER //
// ./app/components/PopoverAlert/index.jsx