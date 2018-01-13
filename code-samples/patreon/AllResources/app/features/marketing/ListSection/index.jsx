import t from 'prop-types'
import React, { Component } from 'react'

import Block from 'components/Layout/Block'
import Col from 'components/Layout/Col'

import Section from 'features/marketing/Section'

import Item from './components/Item'

class ListSection extends Component {
    static propTypes = {
        /**
       * Color theme of section, to feed into Section
       * and to define the colors of the icons
       **/
        color: t.oneOf(['light', 'dark']),
        items: t.arrayOf(
            t.shape({
                // Type of icon to place next-to or above title
                icon: t.string,
                iconSize: t.string,
                // Header text for the item
                title: t.string.isRequired,
                // Smaller descriptive text to go under title text
                description: t.string,
            }),
        ),
        maxWidth: t.oneOf(['sm', 'md', 'lg', 'xl']),
        numColumns: t.number,
        title: t.string,
        subtitle: t.string,
        inlineIcons: t.bool,
        itemAlignment: t.oneOf(['left', 'center', 'right']),
        uppercaseTitles: t.bool,
        uppercaseDescriptions: t.bool,
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
    }

    static defaultProps = {
        numColumns: 2,
        maxWidth: 'md',
        inlineIcons: true,
        iconSize: {
            iconSize: 'xxl',
        },
    }

    renderListItem = (itemProps, textColor, iconColors, i) => {
        const {
            inlineIcons,
            items,
            itemAlignment,
            numColumns,
            uppercaseTitles,
            uppercaseDescriptions,
        } = this.props
        const width = 12 / numColumns
        let offset = 0
        // If the number of items is not perfectly divisible by the # of columns,
        // then offset the start of last row to center the last row
        if (
            items.length % numColumns !== 0 &&
            i === items.length - numColumns + 1
        ) {
            offset = width / 2
        }

        return (
            <Col
                xs={12}
                sm={width}
                offset={{ xs: 0, sm: offset }}
                key={`section-item-${i}`}
            >
                <Block ph={1} pv={2}>
                    <Item
                        {...itemProps}
                        align={itemAlignment}
                        color={textColor}
                        iconColors={iconColors}
                        inline={inlineIcons}
                        uppercaseTitle={uppercaseTitles}
                        uppercaseDescription={uppercaseDescriptions}
                    />
                </Block>
            </Col>
        )
    }

    render() {
        const { color, items, maxWidth, title, pv, ph, subtitle } = this.props
        const textColor = color === 'dark' ? 'light' : 'dark'
        const iconColors = [textColor, 'highlightPrimary']
        return (
            <Section
                color={color}
                maxWidth={maxWidth}
                title={title}
                subtitle={subtitle}
                pv={pv}
                ph={ph}
            >
                {items.map((item, i) =>
                    this.renderListItem(item, textColor, iconColors, i),
                )}
            </Section>
        )
    }
}

export default ListSection



// WEBPACK FOOTER //
// ./app/features/marketing/ListSection/index.jsx