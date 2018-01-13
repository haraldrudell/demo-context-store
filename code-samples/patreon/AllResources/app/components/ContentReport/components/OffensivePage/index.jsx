import React from 'react'
import Text from 'components/Text'
import TextButton from 'components/TextButton'

const OffensivePage = () => (
    <Text>
        {`Please note that content that may be offensive is not prohibited in our `}{' '}
        <TextButton href="https://www.patreon.com/guidelines" target="_blank">
            Community Guidelines
        </TextButton>
        . If you think this violates one of our guidelines, please go back and
        try your report again.
    </Text>
)

export default OffensivePage



// WEBPACK FOOTER //
// ./app/components/ContentReport/components/OffensivePage/index.jsx