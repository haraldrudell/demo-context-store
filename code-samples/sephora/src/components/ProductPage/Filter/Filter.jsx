// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

// Added by sephora-jsx-loader.js
if (!Sephora.isRootRender) {
    Sephora.Util.InflatorComps.Comps['Filter'] = function Filter(){
        return FilterClass;
    }
}
const {
    colors, dropdown, space
} = require('style');
const { Box, Flex, Grid, Image, Text } = require('components/display');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const Radio = require('components/Inputs/Radio/Radio');
const Filters = require('utils/Filters');
const Dropdown = require('components/Dropdown/Dropdown');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const IconCheckmark = require('components/Icon/IconCheckmark');
const CustomScroll = require('components/CustomScroll/CustomScroll');

// Filter for Ratings and Reviews

const Filter = function () {
    this.state = {
        selected: (this.props.selected || []).reduce((acc, item) => {
            acc[item] = true;
            return acc;
        }, {})
    };

};

Filter.prototype.render = function () {
    let selected = this.state.selected;
    let isMobile = Sephora.isMobile();
    let {
        type,
        values = [],
        labels,
        valueImages,
        buttons,
        columns = 1,
        width = '100%',
        isRightDropdown,
        index,
        children
    } = this.props;

    return isMobile ?
        <Box
            fontSize='h4'>
            {children && <div>
                <Divider
                    height={space[2]}
                    marginX={-space[4]}
                    marginBottom={space[4]}
                    marginTop={index > 0 ? space[4] : null} />
                <Text
                    is='h3'
                    fontWeight={700}
                    lineHeight={2}>
                    {children}
                </Text>
                <Divider
                    marginTop={space[4]}
                    marginBottom={space[3]} />
            </div> }

            <Grid
                gutter={space[4]}>
                {values.map((value, idx) =>
                    <Grid.Cell
                        width={1 / columns}>
                    {(columns === 1 && idx > 0) &&
                        <Divider />
                    }
                    {this.getControl(type, value, labels ? labels[idx] : value,
                        valueImages ? valueImages[idx] : null, selected[value])}
                    </Grid.Cell>
                )}
            </Grid>
        </Box>
        :
        <Dropdown
            onTrigger={this.toggleDropdownOpen}>
            <Dropdown.Trigger>
                <Link
                    padding={space[2]}
                    margin={-space[2]}
                    arrowDirection={this.state.isDropdownOpen ? 'up' : 'down'}>
                    {children}
                </Link>
            </Dropdown.Trigger>
            <Dropdown.Menu
                lazyLoad={'img'}
                fontSize='h4'
                width={width}
                minWidth={180}
                withArrow={true}
                isCentered={!isRightDropdown}
                right={isRightDropdown}
                marginTop={dropdown.ARROW_SIZE}
                padding={space[3]}>
                <CustomScroll
                    maxHeight={columns > 1 ? 286 : null}>
                    <Grid
                        gutter={space[4]}>
                    {values.map((value, idx) =>
                        <Grid.Cell
                            width={1 / columns}>
                            {this.getControl(type, value, labels ? labels[idx] : value,
                            valueImages ? valueImages[idx] : null, selected[value])}
                        </Grid.Cell>
                    )}
                    </Grid>
                </CustomScroll>
                {buttons}
            </Dropdown.Menu>
        </Dropdown>;

};

Filter.prototype.getSelected = function () {
    return Object.keys(this.state.selected).filter(key => this.state.selected[key]);
};

Filter.prototype.getControl = function (type, value, label, image, selected) {
    const isMobile = Sephora.isMobile();
    // TODO: Remove this once the API is corrected
    if (label === 'Straightening/Smoothing') {
        label = 'Straightening';
    }
    switch (type) {
        case Filters.TYPES.CHECKBOX:
            const imageSize = isMobile ? 36 : 24;
            return (
                image ?
                <Flex
                    is='label'
                    alignItems='center'
                    paddingY={isMobile ? space[3] : space[1]}
                    lineHeight={2}
                    cursor='pointer'
                    hoverColor='gray'>
                    <Box
                        is='input'
                        type='checkbox'
                        position='absolute'
                        zIndex={-1}
                        opacity={0}
                        onClick={() => this.onItemToggled(value)}
                        value={value}
                        checked={selected} />
                    <Box
                        rounded={7}
                        overflow='hidden'
                        marginRight={space[3]}
                        border={3}
                        borderColor={selected ? colors.black : 'transparent'}
                        flexShrink={0}>
                        <Image
                            display='block'
                            src={image}
                            width={imageSize}
                            height={imageSize} />
                    </Box>
                    <Text>{label}</Text>
                </Flex>
                :
                <Checkbox
                    paddingY={space[2]}
                    checked={selected}
                    onClick={() => this.onItemToggled(value)}
                    value={value}>
                    {label}
                </Checkbox>
            );
        case Filters.TYPES.RADIO:
            return (
                <Link
                    is='label'
                    display='flex'
                    alignItems='center'
                    isActive={selected}
                    lineHeight={2}
                    paddingY={isMobile ? space[4] : space[3]}
                    paddingX={!isMobile ? space[3] : null}
                    fontWeight={selected ? 700 : null}
                    _css={isMobile ? {
                        '&:not(:last-child)': {
                            borderBottomWidth: 1,
                            borderColor: colors.lightGray
                        }
                    } : {}}>
                    <Box
                        is='input'
                        type='radio'
                        position='absolute'
                        zIndex={-1}
                        opacity={0}
                        onClick={() => this.onItemToggled(value)}
                        value={value}
                        checked={selected} />
                    {isMobile &&
                        <IconCheckmark
                            flexShrink={0}
                            marginRight={space[4]}
                            visibility={!selected ? 'hidden' : null} />
                    }
                    <Text>{label}</Text>
                </Link>
            );
        default:
            return null;
    }
};


// Added by sephora-jsx-loader.js
Filter.prototype.path = 'ProductPage/Filter';
// Added by sephora-jsx-loader.js
Object.assign(Filter.prototype, require('./Filter.c.js'));
var originalDidMount = Filter.prototype.componentDidMount;
Filter.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Filter');
if (originalDidMount) originalDidMount.apply(this);
if (Filter.prototype.ctrlr) Filter.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Filter');
// Added by sephora-jsx-loader.js
Filter.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Filter.prototype.class = 'Filter';
// Added by sephora-jsx-loader.js
Filter.prototype.getInitialState = function() {
    Filter.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Filter.prototype.render = wrapComponentRender(Filter.prototype.render);
// Added by sephora-jsx-loader.js
var FilterClass = React.createClass(Filter.prototype);
// Added by sephora-jsx-loader.js
FilterClass.prototype.classRef = FilterClass;
// Added by sephora-jsx-loader.js
Object.assign(FilterClass, Filter);
// Added by sephora-jsx-loader.js
module.exports = FilterClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/Filter/Filter.jsx