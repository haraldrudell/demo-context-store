import React from 'react'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import Block from 'components/Layout/Block'

const PostReportPage = () => (
    <Text>
        Please submit your report directly from the violating post so we can
        process your report faster.
        <Block displayType="inline">
            You can learn how to do that{' '}
            <TextButton
                target="_blank"
                href="https://patreon.zendesk.com/hc/en-us/articles/204914235-Where-can-I-report-a-creator-s-page-"
            >
                here
            </TextButton>
            .
        </Block>
    </Text>
)

export default PostReportPage



// WEBPACK FOOTER //
// ./app/components/ContentReport/components/PostReportPage/index.jsx