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
    Sephora.Util.InflatorComps.Comps['Preview'] = function Preview(){
        return PreviewClass;
    }
}
const { space, zIndex } = require('style');
const { Box, Flex, Text } = require('components/display');
const InputDate = require('components/Inputs/InputDate/InputDate');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const Radio = require('components/Inputs/Radio/Radio');
const IconCross = require('components/Icon/IconCross');

let Preview = function () {
    this.state = {
        shouldSeePreview: false,
        assets: true,
        oosItems: false,
        dropdownOpen: false,
        calendarOpen: false
    };
};

Preview.prototype.render = function () {
    const isTouch = Sephora.isTouch;
    let shouldSeePreview = this.state.shouldSeePreview;

    return shouldSeePreview ? (
        <Box
            backgroundColor='#04E3FF'
            padding={space[3]}
            position='fixed'
            zIndex={zIndex.MAX}
            bottom={0} left={0}
            onMouseEnter={!isTouch && (() => this.setState({
                dropdownOpen: true
            }))}
            onMouseLeave={!isTouch && (() => this.setState({
                dropdownOpen: this.state.calendarOpen ? true : false
            }))}>
            <Flex
                fontSize='h3'
                fontWeight={700}
                justifyContent='space-between'
                marginBottom={space[2]}>
                <Text>
                    Preview Settings
                </Text>
                {isTouch &&
                    <Box
                        padding={space[3]}
                        marginY={-space[3]}
                        marginRight={-space[3]}
                        fontSize='h2'
                        lineHeight={0}
                        onClick={() => this.setState({
                            dropdownOpen: !this.state.dropdownOpen
                        })}>
                        <IconCross x={this.state.dropdownOpen} />
                    </Box>
                }
            </Flex>
            <InputDate
                noMargin={true}
                ref={c => this.date = c}
                type='datetime-local'
                step='300'
                onFocus={() => this.setState({
                    calendarOpen: true
                })}
                onBlur={() => this.setState({
                    calendarOpen: false
                })} />
            <Box
                marginTop={space[4]}
                style={{
                    display: !this.state.dropdownOpen ? 'none' : null
                }}>
                {this.state.message &&
                    <Text
                        is='p'
                        marginBottom={space[2]}
                        color='error'>
                        {this.state.message}
                    </Text>
                }
                <Text
                    is='p'
                    fontWeight={700}
                    marginBottom={space[1]}>
                    Show assets
                </Text>
                <Radio
                    name='previewAssets'
                    checked={this.state.assets}
                    value={1}
                    onChange={e => this.setState({
                        assets: e.currentTarget.value === '1'
                    })}>
                    Active
                </Radio>
                <Radio
                    name='previewAssets'
                    checked={!this.state.assets}
                    value={0}
                    onChange={e => this.setState({
                        assets: e.currentTarget.value === '1'
                    })}>
                    All
                </Radio>
                <Box
                    marginY={space[3]}>
                    <Radio
                        name='previewOOS'
                        checked={!this.state.oosItems}
                        value={0}
                        onChange={e => this.setState({
                            oosItems: e.currentTarget.value === '1'
                        })}>
                        View based on actual inventory
                    </Radio>
                    <Radio
                        name='previewOOS'
                        checked={this.state.oosItems}
                        value={1}
                        onChange={e => this.setState({
                            oosItems: e.currentTarget.value === '1'
                        })}>
                        View as in-stock (ignore inventory)
                    </Radio>
                </Box>
                <ButtonPrimary
                    paddingX={space[6]}
                    onClick={this.setPreview}>
                    Go
                </ButtonPrimary>
            </Box>
        </Box>
    ) : null;
};


// Added by sephora-jsx-loader.js
Preview.prototype.path = 'Preview';
// Added by sephora-jsx-loader.js
Object.assign(Preview.prototype, require('./Preview.c.js'));
var originalDidMount = Preview.prototype.componentDidMount;
Preview.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: Preview');
if (originalDidMount) originalDidMount.apply(this);
if (Preview.prototype.ctrlr) Preview.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: Preview');
// Added by sephora-jsx-loader.js
Preview.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
Preview.prototype.class = 'Preview';
// Added by sephora-jsx-loader.js
Preview.prototype.getInitialState = function() {
    Preview.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Preview.prototype.render = wrapComponentRender(Preview.prototype.render);
// Added by sephora-jsx-loader.js
var PreviewClass = React.createClass(Preview.prototype);
// Added by sephora-jsx-loader.js
PreviewClass.prototype.classRef = PreviewClass;
// Added by sephora-jsx-loader.js
Object.assign(PreviewClass, Preview);
// Added by sephora-jsx-loader.js
module.exports = PreviewClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Preview/Preview.jsx