import t from 'prop-types'
import React from 'react'

import Col from 'components/Layout/Col'
import Text from 'components/Text'
import Grid from 'components/Layout/Grid'
import Row from 'components/Layout/Row'
import Flexy from 'components/Layout/Flexy'

import Title from './components/Title'

import DEFAULT_PADDING from './constants/padding'

const Section = ({
    children,
    color,
    maxWidth,
    pv,
    ph,
    title,
    subtitle,
    noTitleMargin,
    lowercaseTitle,
    wrapCol,
}) => {
    return (
        <Grid
            backgroundColor={color}
            pv={pv ? pv : DEFAULT_PADDING.pv}
            ph={ph ? ph : DEFAULT_PADDING.ph}
            maxWidth={maxWidth}
            noOverflow
        >
            {title && (
                <Row>
                    <Col xs={12}>
                        <Title
                            text={title}
                            sectionColor={color}
                            noMargin={noTitleMargin}
                            lowercase={lowercaseTitle}
                        />
                        {subtitle && (
                            <Flexy justifyContent={'center'}>
                                <Text
                                    align={'center'}
                                    color={
                                        color === 'dark' ? 'white' : undefined
                                    }
                                    size={2}
                                >
                                    {subtitle}
                                </Text>
                            </Flexy>
                        )}
                    </Col>
                </Row>
            )}
            <Row>{wrapCol ? <Col xs={12}>{children}</Col> : children}</Row>
        </Grid>
    )
}

Section.propTypes = {
    children: t.node.isRequired,
    maxWidth: t.oneOf(['sm', 'md', 'lg']),
    /**
   * Add horizontal padding in units to the grid at various breakpoints.
   * Defaults to 2 units of padding at all sizes.
   */
    ph: t.shape({
        xs: t.number,
        sm: t.number,
        md: t.number,
        lg: t.number,
        xl: t.number,
    }),
    /**
   * Add vertical padding in units to the grid at various breakpoints.
   */
    pv: t.shape({
        xs: t.number,
        sm: t.number,
        md: t.number,
        lg: t.number,
        xl: t.number,
    }),
    /*
   * Defines background color as well as text color
   * undefined => normal page background gray
   */
    color: t.oneOf(['dark', 'light']),
    /**
   * Title text to appear at the top of the section
   */
    title: t.string,
    subtitle: t.string,
    noTitleMargin: t.bool,
    lowercaseTitle: t.bool,
    wrapCol: t.bool,
}

export default Section



// WEBPACK FOOTER //
// ./app/features/marketing/Section/index.jsx