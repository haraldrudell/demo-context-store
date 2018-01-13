import t from 'prop-types'
import React from 'react'

import Button from 'components/Button'
import Flexy from 'components/Layout/Flexy'
import Text from 'components/Text'

const ButtonGroup = props => {
    const { buttons, content, onSelect, selected } = props
    const buttonContent = content || buttons

    return (
        <Flexy display="inline-flex">
            {buttons.map((btn, i) => {
                const isSelected = btn === selected
                const textColor = isSelected ? 'gray2' : 'gray3'

                return (
                    <Button
                        color={isSelected ? 'pagination:active' : 'pagination'}
                        onClick={!isSelected ? () => onSelect(btn) : null}
                        size="xs"
                        key={`${btn}-btn`}
                    >
                        <Text color={textColor} size={0} weight="bold">
                            {buttonContent[i]}
                        </Text>
                    </Button>
                )
            })}
        </Flexy>
    )
}

ButtonGroup.propTypes = {
    /**
     *  Array of button label strings
     **/
    buttons: t.arrayOf(t.string).isRequired,
    /**
     *  Array of button content. Defaults to props.buttons value if not defined
     **/
    content: t.arrayOf(t.oneOfType([t.node, t.string])),
    /**
     * Callback for a button clicked that takes in button inner text / label
     **/
    onSelect: t.func,
    /**
     * String of button label currently selected
     **/
    selected: t.string,
}

export default ButtonGroup



// WEBPACK FOOTER //
// ./app/components/ButtonGroup/index.jsx