/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import getWindow from 'utilities/get-window'

import Block from 'components/Layout/Block'
import Button from 'components/Button'
import Checkbox from 'components/Form/Checkbox'
import Input from 'components/Form/Input'
import Text from 'components/Text'

const windowOrFixture = getWindow()

export default class Form extends Component {
    static propTypes = {
        action: PropTypes.string,
        fields: PropTypes.array,
        method: PropTypes.string,
        onToggleChange: PropTypes.func,
        submitLabel: PropTypes.string,
        toggles: PropTypes.object,
        confirmMessage: PropTypes.string,
    }

    render() {
        const {
            action,
            method,
            fields,
            submitLabel,
            toggles,
            onToggleChange,
            confirmMessage,
        } = this.props

        return (
            <Block pv={1} mt={1}>
                <form action={action} method={method}>
                    {fields.map((f, i) => {
                        const inputProps = {
                            ...f,
                            defaultValue: f.value,
                            // We need to explicitly overwrite the value prop as undefined when
                            // setting a default value. If we set it to null, it still technically
                            // counts as a value, and React 15 complains about using value and
                            // defaultValue in the same input element
                            value: undefined,
                        }
                        let input = <input key={i} {...inputProps} />

                        if (f.type === 'hidden') return input

                        if (f.type === 'checkbox') {
                            const toggle = toggles[inputProps.name] || false

                            return (
                                <Block key={i} mb={1}>
                                    <Checkbox
                                        key={i}
                                        size="sm"
                                        {...inputProps}
                                        checked={toggle}
                                        description={
                                            <Text color="gray6">{f.label}</Text>
                                        }
                                        onChange={() =>
                                            onToggleChange(
                                                inputProps.name,
                                                !toggle,
                                            )}
                                    />
                                </Block>
                            )
                        }
                        if (f.type === 'text' || f.type === 'search') {
                            input = (
                                <Block mt={1}>
                                    <Text color="light">
                                        <Input
                                            key={i}
                                            name={f.name}
                                            initialValue={f.value}
                                            placeholder={f.placeholder}
                                        />
                                    </Text>
                                </Block>
                            )
                        }

                        return (
                            <Block key={i} mb={2}>
                                <Text el="label" color="gray6">
                                    {f.label}
                                </Text>
                                {input}
                            </Block>
                        )
                    })}
                    <Button
                        size="sm"
                        color="primary"
                        type="submit"
                        value={submitLabel}
                        onClick={
                            confirmMessage
                                ? e => {
                                      windowOrFixture.confirm(confirmMessage) ||
                                          e.preventDefault()
                                  }
                                : null
                        }
                        input
                    />
                </form>
            </Block>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/AdminPanel/components/Form/index.jsx