import t from 'prop-types'
import React, { Component } from 'react'
import moment from 'moment'

import Block from 'components/Layout/Block'
import Button from 'components/Button'
import Checkbox from 'components/Form/Checkbox'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import SimpleRadioButton from 'components/Form/SimpleRadioButton'
import Text from 'components/Text'
import timeLeft from 'utilities/time-left'
import { formatPercentRound } from 'utilities/format-percent'

import { INSTANT_ACCESS, SINGLE_POST } from 'constants/feednames'

import { POLL_EVENTS, logPollEvent } from 'analytics'

import {
    AmountContainer,
    PostPollInfoWrapper,
    StyledChoiceBar,
    StyledChoiceTextAndBar,
} from './styled-components'

class PostPollInfo extends Component {
    static propTypes = {
        multipleChoice: t.bool,
        choices: t.arrayOf(
            t.shape({
                text: t.string,
                selected: t.bool,
                votes: t.number,
                onChange: t.func,
            }),
        ),
        feedName: t.string,
        isPollAuthor: t.bool,
        pollHasClosed: t.bool,
        pollEndDateString: t.string,
        pollId: t.string,
        postId: t.string,
    }

    componentDidMount() {
        if (
            this.props.feedName === SINGLE_POST ||
            this.props.feedName === INSTANT_ACCESS
        ) {
            logPollEvent({
                title: POLL_EVENTS.LANDED,
                info: {
                    post_id: this.props.postId,
                    poll_id: this.props.pollId,
                    source: this.props.feedName,
                },
            })
        }
    }

    renderChoice(c, totalVotes) {
        const fractionVotes = c.votes / totalVotes
        let choiceAmount = ''

        const showResults =
            this.props.choices.some(curChoice => curChoice.selected) ||
            this.props.isPollAuthor ||
            this.props.pollHasClosed
        let percentageVotes = '0%'
        if (totalVotes > 0 && showResults) {
            percentageVotes = formatPercentRound(fractionVotes)
        }
        if (showResults) {
            if (this.props.multipleChoice) {
                // amount is represented in votes
                choiceAmount = c.votes
            } else {
                // amount is represented in percentage of total votes
                choiceAmount = percentageVotes
            }
        }

        let input
        if (this.props.multipleChoice) {
            input = (
                <Checkbox
                    noMargin
                    checked={c.selected}
                    onChange={() => c.onChange(!c.selected)}
                    disabled={this.props.pollHasClosed}
                />
            )
        } else {
            input = (
                <Flexy alignItems="center">
                    <SimpleRadioButton
                        checked={c.selected}
                        onChange={c.onChange}
                        disabled={this.props.pollHasClosed}
                    />
                </Flexy>
            )
        }

        return (
            <Block key={c.position} mb={2}>
                <Flexy alignItems="center" direction="row">
                    <Flexy direction="row" grow={2} alignItems="center">
                        <Block mr={1}>
                            {input}
                        </Block>
                        <StyledChoiceTextAndBar
                            onClick={() => {
                                if (!this.props.pollHasClosed) {
                                    c.onChange(!c.selected)
                                }
                            }}
                            showResults={showResults}
                        >
                            <StyledChoiceBar
                                percentageVotes={percentageVotes}
                            />
                            <Text el="p">
                                {c.text}
                            </Text>
                        </StyledChoiceTextAndBar>
                    </Flexy>
                    <AmountContainer>
                        <Text scale="0">
                            {choiceAmount}
                        </Text>
                    </AmountContainer>
                </Flexy>
            </Block>
        )
    }

    renderChoices(totalVotes) {
        return (
            <div>
                {this.props.choices.map(c => this.renderChoice(c, totalVotes))}
            </div>
        )
    }

    renderDownloadResultsButton() {
        return (
            <div className="mt-md mb-md">
                <Button
                    color="tertiary"
                    size="xs"
                    href={`/polls/${this.props.pollId}/responses.csv`}
                >
                    Download results
                </Button>
                <span className="ml-sm">
                    <Text scale="0" color="gray3">
                        <Icon
                            type="lock"
                            size="xxxs"
                            color="gray3"
                        />&nbsp;&nbsp;Only you can see this
                    </Text>
                </span>
            </div>
        )
    }

    render() {
        const totalVotes = this.props.choices.reduce((prev, curr) => {
            return prev + curr.votes
        }, 0)

        const totalVotesString =
            `${totalVotes} vote` + (totalVotes !== 1 ? 's' : '') + ' total'
        let metaContent

        if (this.props.pollHasClosed) {
            const pollEndDate = moment(this.props.pollEndDateString)
            metaContent = (
                <span>
                    <Text scale="0" color="gray3">
                        Poll ended {pollEndDate.format('MMM D, YYYY')}
                    </Text>
                    <Block display="inline" mh={0.5}>
                        <Text color="gray3">&middot;</Text>
                    </Block>
                    <Text scale="0" color="gray3">
                        {totalVotesString}
                    </Text>
                </span>
            )
        } else if (this.props.pollEndDateString) {
            const pollEndDate = moment(this.props.pollEndDateString)
            metaContent = (
                <span>
                    <Text scale="0" color="gray3">
                        {totalVotesString}
                    </Text>
                    <Block display="inline" mh={0.5}>
                        <Text color="gray3">&middot;</Text>
                    </Block>{' '}
                    <Text scale="0" color="gray3">
                        {timeLeft(pollEndDate)}
                    </Text>
                </span>
            )
        } else {
            metaContent = (
                <Text scale="0" color="gray3">
                    {totalVotesString}
                </Text>
            )
        }

        return (
            <PostPollInfoWrapper>
                {this.renderChoices(totalVotes)}
                {metaContent}
                {this.props.isPollAuthor && this.renderDownloadResultsButton()}
            </PostPollInfoWrapper>
        )
    }
}

export default PostPollInfo



// WEBPACK FOOTER //
// ./app/components/PostPollInfo/index.jsx