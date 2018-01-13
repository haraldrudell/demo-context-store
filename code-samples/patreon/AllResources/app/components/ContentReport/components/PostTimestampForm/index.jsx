import React, { Component } from 'react'
import PropTypes from 'prop-types'
import reformDecorator from 'libs/reform'
import Text from 'components/Text'
import Icon from 'components/Icon'
import Grid from 'components/Layout/Grid'
import Row from 'components/Layout/Row'
import Col from 'components/Layout/Col'
import Flexy from 'components/Layout/Flexy'
import Block from 'components/Layout/Block'
import TimestampRow from '../TimestampRow'
import { contentReportEvidenceDeclaration } from '../../utilities'

@reformDecorator(contentReportEvidenceDeclaration)
class PostTimestampForm extends Component {
    static propTypes = {
        reform: PropTypes.object,
        targetMediaType: PropTypes.oneOf(['video', 'audio']),
    }

    mediaTypePhrase() {
        const { targetMediaType } = this.props
        if (targetMediaType === 'video') {
            return 'video'
        }
        if (targetMediaType === 'audio') {
            return 'audio file'
        }
        return 'media file'
    }

    render() {
        const { reform } = this.props
        return (
            <Grid p={{ xs: 0 }}>
                <Row>
                    <Col xs={1}>
                        <Block mb={1} mt={1}>
                            <Text size={1}>
                                <Icon type="lightbulb" color="subdued" />
                            </Text>
                        </Block>
                    </Col>
                    <Col xs={11}>
                        <Text>
                            {' '}
                            If you can tell us exactly where to look in this{' '}
                            {this.mediaTypePhrase()} we can process your report
                            faster!
                        </Text>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={11}>
                        <Flexy alignContent="flex-end">
                            <TimestampRow suffix="" reform={reform} />
                        </Flexy>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <Block mt={-2} mb={-2}>
                            <Text
                                color="gray3"
                                size={0}
                            >{`Don't worry, if you need to close this window to find the timestamp we'll save your progress.`}</Text>
                        </Block>
                    </Col>
                </Row>
            </Grid>
        )
    }
}

export default PostTimestampForm



// WEBPACK FOOTER //
// ./app/components/ContentReport/components/PostTimestampForm/index.jsx