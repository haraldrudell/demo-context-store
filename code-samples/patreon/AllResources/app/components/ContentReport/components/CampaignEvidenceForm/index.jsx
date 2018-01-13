import React, { Component } from 'react'
import PropTypes from 'prop-types'
import reformDecorator from 'libs/reform'
import { withState } from 'recompose'
import Block from 'components/Layout/Block'
import Button from 'components/Button'
import Input from 'components/Form/Input'
import InputWrapper from 'components/Form/InputWrapper'
import Text from 'components/Text'
import { contentReportEvidenceDeclaration } from '../../utilities'
import TimestampRow from '../TimestampRow'

@reformDecorator(contentReportEvidenceDeclaration)
@withState('inputsVisible', 'setInputsVisible', 1)
class CampaignEvidenceForm extends Component {
    static propTypes = {
        reform: PropTypes.object,
        inputsVisible: PropTypes.number,
        setInputsVisible: PropTypes.func,
    }

    visibleUrlFilled() {
        if (this.props.inputsVisible === 1) {
            return Boolean(this.props.reform.reportEvidence.model.url1)
        }
        if (this.props.inputsVisible === 2) {
            return Boolean(this.props.reform.reportEvidence.model.url2)
        }
        return false
    }

    render() {
        const { reform, inputsVisible, setInputsVisible } = this.props
        return (
            <div>
                <Block mb={3}>
                    <Text color="gray3">
                        Point us to where we can confirm your report. If your
                        link is a video or audio file, please include a
                        timestamp so we can process your report faster!
                    </Text>
                </Block>
                <Block mb={1}>
                    <Text el="div" weight="bold">
                        Evidence
                    </Text>
                    <InputWrapper
                        input={{
                            name: 'url1',
                            type: 'text',
                            placeholder: 'http://',
                            label: 'link',
                            component: Input,
                        }}
                        {...reform.reportEvidence}
                    />
                    <TimestampRow suffix="1" reform={reform} />
                </Block>
                {this.props.inputsVisible > 1 && (
                    <Block mb={1} mt={-2}>
                        <Text el="div" weight="bold">
                            More Evidence
                        </Text>
                        <InputWrapper
                            input={{
                                name: 'url2',
                                type: 'text',
                                placeholder: 'http://',
                                label: 'link',
                                component: Input,
                            }}
                            {...reform.reportEvidence}
                        />
                        <TimestampRow suffix="2" reform={reform} />
                    </Block>
                )}
                {this.props.inputsVisible > 2 && (
                    <Block mb={-1} mt={-2}>
                        <Text el="div" weight="bold">
                            Even More Evidence
                        </Text>
                        <InputWrapper
                            input={{
                                name: 'url3',
                                type: 'text',
                                placeholder: 'http://',
                                label: 'link',
                                component: Input,
                            }}
                            {...reform.reportEvidence}
                        />
                        <TimestampRow suffix="3" reform={reform} />
                    </Block>
                )}
                {inputsVisible < 3 && (
                    <Block mb={2}>
                        <Button
                            size="sm"
                            color="tertiary"
                            onClick={() => {
                                setInputsVisible(inputsVisible + 1)
                            }}
                            disabled={!this.visibleUrlFilled()}
                        >
                            Add More
                        </Button>
                    </Block>
                )}
            </div>
        )
    }
}

export default CampaignEvidenceForm



// WEBPACK FOOTER //
// ./app/components/ContentReport/components/CampaignEvidenceForm/index.jsx