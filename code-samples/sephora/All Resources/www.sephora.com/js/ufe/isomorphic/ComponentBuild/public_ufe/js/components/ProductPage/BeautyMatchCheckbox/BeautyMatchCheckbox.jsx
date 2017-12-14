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
    Sephora.Util.InflatorComps.Comps['BeautyMatchCheckbox'] = function BeautyMatchCheckbox(){
        return BeautyMatchCheckboxClass;
    }
}
const { space } = require('style');
const { Box, Flex, Text } = require('components/display');
const IconInfo = require('components/Icon/IconInfo');
const Popover = require('components/Popover/Popover');
const Checkbox = require('components/Inputs/Checkbox/Checkbox');
const BeautyMatchBadge = require('components/BeautyMatchBadge/BeautyMatchBadge');
const userUtils = require('utils/User');

const BeautyMatchCheckbox = function () {
    this.state = {
        checked: this.props.checked
    };
};

BeautyMatchCheckbox.prototype.render = function () {

    const isMobile = Sephora.isMobile();
    let hasAllTraits = Sephora.isRootRender ? false : this.hasAllTraits();

    const checkbox = <Checkbox
        name='beautyMatch'
        checked={this.state.checked && hasAllTraits}
        onClick={this.toggle}>
        <Flex
            alignItems='center'>
            <Text
                marginRight={space[1]}>
                {this.props.label} from my
            </Text>
            <BeautyMatchBadge
                isPlural={true}
                isVerticalAlign={true} />
        </Flex>
    </Checkbox>;

    return (
        <Flex
            alignItems='center'
            whiteSpace='nowrap'>
            {
                hasAllTraits || !userUtils.isBI() ? checkbox : <Popover
                    content={'It looks like you are missing some Beauty Traits. ' +
                        'Please go to your profile to complete this information.'}
                    placement='top'>
                    { checkbox }
                </Popover>
            }
            <Popover
                content={'A Beauty Match is someone who shares your beauty traits — ' +
                    'eye color, hair color, skin tone and type'}
                placement='top'
                _css={isMobile ? {
                    left: 'auto',
                    right: -space[2]
                } : null}
                arrowStyle={isMobile ? {
                    left: 'auto',
                    right: space[2]
                } : null}>
                <Box
                    padding={space[1]}
                    marginY={-space[1]}
                    lineHeight={0}
                    color='moonGray'
                    hoverColor='black'>
                    <IconInfo />
                </Box>
            </Popover>
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
BeautyMatchCheckbox.prototype.path = 'ProductPage/BeautyMatchCheckbox';
// Added by sephora-jsx-loader.js
Object.assign(BeautyMatchCheckbox.prototype, require('./BeautyMatchCheckbox.c.js'));
var originalDidMount = BeautyMatchCheckbox.prototype.componentDidMount;
BeautyMatchCheckbox.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BeautyMatchCheckbox');
if (originalDidMount) originalDidMount.apply(this);
if (BeautyMatchCheckbox.prototype.ctrlr) BeautyMatchCheckbox.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BeautyMatchCheckbox');
// Added by sephora-jsx-loader.js
BeautyMatchCheckbox.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BeautyMatchCheckbox.prototype.class = 'BeautyMatchCheckbox';
// Added by sephora-jsx-loader.js
BeautyMatchCheckbox.prototype.getInitialState = function() {
    BeautyMatchCheckbox.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BeautyMatchCheckbox.prototype.render = wrapComponentRender(BeautyMatchCheckbox.prototype.render);
// Added by sephora-jsx-loader.js
var BeautyMatchCheckboxClass = React.createClass(BeautyMatchCheckbox.prototype);
// Added by sephora-jsx-loader.js
BeautyMatchCheckboxClass.prototype.classRef = BeautyMatchCheckboxClass;
// Added by sephora-jsx-loader.js
Object.assign(BeautyMatchCheckboxClass, BeautyMatchCheckbox);
// Added by sephora-jsx-loader.js
module.exports = BeautyMatchCheckboxClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/BeautyMatchCheckbox/BeautyMatchCheckbox.jsx