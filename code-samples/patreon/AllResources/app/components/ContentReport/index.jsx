import React, { Component } from 'react'
import PropTypes from 'prop-types'
import nion from 'nion'
import reform from 'libs/reform'
import get from 'lodash/get'
import last from 'lodash/last'

import { buildUrl, JsonApiPayload } from 'utilities/json-api'
import getDataOrNot from 'utilities/get-data-or-not'
import RadioGroup from 'components/Form/RadioGroup'
import Button from 'components/Button'
import Block from 'components/Layout/Block'
import NewModalWithContent from 'components/NewModalWithContent'
import CardWithHeader from 'components/CardWithHeader'
import Flexy from 'components/Layout/Flexy'

import { ModalContentWrapper } from './styled-components'
import { CONTENT_FLOW } from './constants/contentFlow'
import { CAMPAIGN_FLOW } from './constants/campaignFlow'
import { PROFILE_FLOW, NO_REWARD, NOT_CREATING } from './constants/profileFlow'
import { EXTERNAL_FLOW } from './constants/externalFlow'
import {
    POST,
    CAMPAIGN,
    MONOCLE_CLIP,
    PROFILE,
    EXTERNAL,
    COPYRIGHT,
    INITIAL,
    OFFENSIVE,
    SUCCESS,
    EVIDENCE,
} from './constants/core'
import {
    contentReportEvidenceDeclaration,
    timestampSecsFromInputs,
} from './utilities'

const flows = {
    [POST]: CONTENT_FLOW,
    [CAMPAIGN]: CAMPAIGN_FLOW,
    [PROFILE]: PROFILE_FLOW,
    [EXTERNAL]: EXTERNAL_FLOW,
    [MONOCLE_CLIP]: CONTENT_FLOW,
}

const basicPages = {
    [SUCCESS]: {
        header: 'Report submitted',
        componentName: 'SuccessPage',
    },
    [OFFENSIVE]: {
        header: 'This is offensive',
        componentName: 'OffensivePage',
    },
}

@nion({
    currentUser: {},
    contentReport: { endpoint: buildUrl('/content-reports') },
})
@reform(contentReportEvidenceDeclaration)
class ContentReport extends Component {
    static propTypes = {
        /* may include comments and messages in the future */
        targetType: PropTypes.oneOf([POST, CAMPAIGN, MONOCLE_CLIP]).isRequired,
        targetId: PropTypes.string.isRequired,
        onReportClose: PropTypes.func.isRequired,
        /* optional, currently only used with POST targetType (implies need for timestamp) */
        targetMediaType: PropTypes.oneOf(['video', 'audio']),
        /* optional, for closing report modal and remounting with saved state */
        reportStateHistory: PropTypes.array,
        useModal: PropTypes.bool,
        modalIsOpen: PropTypes.bool,
        nion: PropTypes.object.isRequired,
        reform: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props)

        if (props.reportStateHistory) {
            const savedHistory = [...props.reportStateHistory]
            this.state = savedHistory.pop()
            this.stateHistory = savedHistory
        } else {
            const pages = {
                ...basicPages,
                ...flows[props.targetType],
            }
            this.state = {
                pages,
                page: pages[INITIAL],
                selected: null,
            }
            this.stateHistory = []
        }
    }

    isExternalCampaignFlow = () =>
        !!this.stateHistory.find(state => state.selected === EXTERNAL)

    isOnEvidencePage = () =>
        this.state.pages[EVIDENCE] &&
        this.state.page.key === this.state.pages[EVIDENCE].key

    addUrlAndTimestamp(model, suffix, payload) {
        const key = `url${suffix}`
        if (!model[key]) {
            return payload
        }
        const newPayload = { ...payload }
        newPayload[`create_evidence_url_${suffix}`] = model[key]
        const hours = model[`hours${suffix}`]
        const minutes = model[`minutes${suffix}`]
        const seconds = model[`seconds${suffix}`]
        const timestampSecs = timestampSecsFromInputs({
            hours,
            minutes,
            seconds,
        })
        if (timestampSecs > 0) {
            newPayload[
                `create_evidence_timestamp_secs_${suffix}`
            ] = timestampSecs
        }
        return newPayload
    }

    addReportEvidence(payload) {
        const { model } = this.props.reform.reportEvidence

        if (!this.reportNeedsEvidence()) {
            return payload
        }

        if (this.isExternalCampaignFlow()) {
            ;['1', '2', '3'].forEach(suffix => {
                payload = this.addUrlAndTimestamp(model, suffix, payload)
            })
            return payload
        }

        // post flow
        const timestampSecs = timestampSecsFromInputs(model)
        if (timestampSecs > 0) {
            payload = {
                ...payload,
                infracting_content_timestamp_secs: timestampSecs,
            }
        }
        return payload
    }

    submitReport({ reason }) {
        const { actions } = this.props.nion.contentReport
        const { id } = getDataOrNot(this.props.nion.currentUser)
        const payload = {
            reported_reason: reason,
            target_type: this.props.targetType,
            target_id: this.props.targetId,
        }
        const payloadWithEvidence = this.addReportEvidence(payload)
        const contentReportPayload = new JsonApiPayload(
            'content-report',
            payloadWithEvidence,
        )
        contentReportPayload.addRelationship('reporter', {
            type: 'user',
            id,
        })
        actions.post(contentReportPayload.toRequest())
    }

    advancePage = ({ nextStatePages, nextPage }) => {
        this.stateHistory.push(this.state)

        this.setState({
            pages: nextStatePages,
            page: nextPage,
            selected: null,
        })
    }

    reportNeedsEvidence = nextStatePages => {
        if (this.props.targetType === POST) {
            return Boolean(this.props.targetMediaType)
        }
        if (
            this.props.targetType === CAMPAIGN &&
            this.isExternalCampaignFlow()
        ) {
            // TODO exceptions with no evidence?
            return true
        }
        // TODO profile flow with evidence?
        return false
    }

    onContinue = () => {
        const { selected, pages, page } = this.state
        const needsNewPages = page.key === CAMPAIGN_FLOW[INITIAL].key
        const nextStatePages = needsNewPages
            ? { ...pages, ...flows[selected] }
            : pages

        const hasDestinationPage = !!nextStatePages[selected]
        const isOnEvidencePage = this.isOnEvidencePage()

        let nextPage
        if (hasDestinationPage) {
            nextPage = nextStatePages[selected]
        } else if (
            !this.reportNeedsEvidence(nextStatePages) ||
            isOnEvidencePage
        ) {
            const reason = isOnEvidencePage
                ? get(last(this.stateHistory), 'selected')
                : selected
            this.submitReport({ reason })
            nextPage = nextStatePages[SUCCESS]
        } else {
            nextPage = nextStatePages[EVIDENCE]
        }
        this.advancePage({ nextStatePages, nextPage })
    }

    onBack = () => {
        this.setState(this.stateHistory.pop())
    }

    postTimestampFormValid = ({ validation, model }) => {
        // do this because only one of the three inputs needs to not be empty
        const notZero = timestampSecsFromInputs(model) > 0
        return validation.isValid && notZero
    }

    campaignEvidenceFormValid = ({ validation, model }) =>
        validation.isValid && Boolean(model['url1'])

    evidenceFormValid = () =>
        this.props.targetType === POST
            ? this.postTimestampFormValid(this.props.reform.reportEvidence)
            : this.campaignEvidenceFormValid(this.props.reform.reportEvidence)

    canContinue = () =>
        this.isOnEvidencePage()
            ? this.evidenceFormValid()
            : !!this.state.selected

    renderPageContent = () => {
        const { page, selected } = this.state
        if (page.componentName) {
            /* require the component function here because putting the function as a value on page object breaks JSON.stringify + local storage. */
            const PageComponent = require(`./components/${page.componentName}`)
                .default
            const { targetId, targetType, targetMediaType } = this.props
            return (
                <Block ml={2} mr={2}>
                    <PageComponent
                        targetId={targetId}
                        targetType={targetType}
                        targetMediaType={targetMediaType}
                        reason={this.maybeGetSubmittedReason()}
                    />
                </Block>
            )
        }
        return (
            <Flexy>
                <RadioGroup
                    vertical
                    isHoverable
                    items={page.choices}
                    name="options"
                    currentValue={selected}
                    onChange={value => this.setState({ selected: value })}
                />
            </Flexy>
        )
    }

    isNextToLastPage = () =>
        this.isOnEvidencePage() ||
        (!this.reportNeedsEvidence() &&
            this.state.selected &&
            !this.state.pages[this.state.selected])

    shouldSaveOnCancel = () =>
        this.isOnEvidencePage() && this.props.targetType !== CAMPAIGN

    handleReportClose = () => {
        if (this.shouldSaveOnCancel()) {
            const { stateHistory } = this
            stateHistory.push(this.state)
            return this.props.onReportClose({ stateHistory })
        }
        this.props.onReportClose({ stateHistory: null })
    }

    maybeGetSubmittedReason = () => {
        let reason = get(last(this.stateHistory), 'selected')
        if (!reason) {
            reason = get(
                this.stateHistory[this.stateHistory.length - 2],
                'selected',
            )
        }
        return reason
    }

    renderLastPageButtons = () => (
        <Flexy
            direction="row"
            alignItems="flex-end"
            alignContent="flex-end"
            justifyContent="flex-end"
        >
            <Block>
                <Button
                    onClick={this.handleReportClose}
                    color="primary"
                    size="sm"
                >
                    Got it
                </Button>
            </Block>
        </Flexy>
    )

    renderButtons = () => (
        <Flexy
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Button onClick={this.handleReportClose} color="tertiary" size="sm">
                {this.shouldSaveOnCancel() ? 'Save & Close' : 'Cancel'}
            </Button>
            <Flexy direction="row" alignItems="center">
                {Boolean(this.stateHistory.length) && (
                    <Block mr={2}>
                        <Button
                            onClick={this.onBack}
                            color="tertiary"
                            size="sm"
                        >
                            Back
                        </Button>
                    </Block>
                )}
                <Button
                    onClick={this.onContinue}
                    disabled={!this.canContinue()}
                    color="primary"
                    size="sm"
                >
                    {this.isNextToLastPage() ? 'Submit' : 'Continue'}
                </Button>
            </Flexy>
        </Flexy>
    )

    render() {
        const content = (
            <ModalContentWrapper>
                {this.renderPageContent()}
            </ModalContentWrapper>
        )

        const isLastPage = [
            this.state.pages[SUCCESS],
            this.state.pages[POST],
            this.state.pages[COPYRIGHT],
            this.state.pages[OFFENSIVE],
            this.state.pages[NOT_CREATING],
            this.state.pages[NO_REWARD],
        ].includes(this.state.page)

        const buttons = isLastPage
            ? this.renderLastPageButtons()
            : this.renderButtons()

        const footer = (
            <Block p={2} bt fluidWidth>
                {buttons}
            </Block>
        )

        return this.props.useModal ? (
            <NewModalWithContent
                width="lg"
                isOpen={this.props.modalIsOpen}
                overlayClosesModal={false}
                closeOnEscape={false}
                isScrollable
                header={this.state.page.header}
                footer={footer}
            >
                {content}
            </NewModalWithContent>
        ) : (
            <CardWithHeader
                title={this.state.page.header}
                hasHeaderBorder
                noPadding
                forceHeaderPadding
            >
                {content}
                {footer}
            </CardWithHeader>
        )
    }
}

export default ContentReport



// WEBPACK FOOTER //
// ./app/components/ContentReport/index.jsx