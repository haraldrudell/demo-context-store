import React from 'react'
import PropTypes from 'prop-types'
import Row from 'components/Layout/Row'
import Col from 'components/Layout/Col'
import Input from 'components/Form/Input'
import InputWrapper from 'components/Form/InputWrapper'

const TimestampRow = ({ suffix, reform }) => (
    <Row>
        <Col xs={12} sm={4}>
            <InputWrapper
                input={{
                    name: `hours${suffix}`,
                    type: 'number',
                    placeholder: '0',
                    label: 'hours',
                    component: Input,
                }}
                {...reform.reportEvidence}
            />
        </Col>
        <Col xs={12} sm={4}>
            <InputWrapper
                input={{
                    name: `minutes${suffix}`,
                    type: 'number',
                    placeholder: '0',
                    label: 'minutes',
                    component: Input,
                }}
                {...reform.reportEvidence}
            />
        </Col>
        <Col xs={12} sm={4}>
            <InputWrapper
                showErrorBeforeBlur
                input={{
                    name: `seconds${suffix}`,
                    type: 'number',
                    placeholder: '0',
                    label: 'seconds',
                    component: Input,
                }}
                {...reform.reportEvidence}
            />
        </Col>
    </Row>
)

TimestampRow.propTypes = {
    suffix: PropTypes.oneOf(['', '1', '2', '3']),
    reform: PropTypes.object,
}

export default TimestampRow



// WEBPACK FOOTER //
// ./app/components/ContentReport/components/TimestampRow/index.jsx