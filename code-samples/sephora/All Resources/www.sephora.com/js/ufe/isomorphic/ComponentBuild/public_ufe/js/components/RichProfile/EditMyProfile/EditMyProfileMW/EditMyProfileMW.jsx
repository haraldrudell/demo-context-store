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
    Sephora.Util.InflatorComps.Comps['EditMyProfileMW'] = function EditMyProfileMW(){
        return EditMyProfileMWClass;
    }
}
const { modal, space } = require('style');
const { Box, Flex, Text } = require('components/display');
const Chevron = require('components/Chevron/Chevron');
const Divider = require('components/Divider/Divider');
const EditMyProfileMW = function () { };

EditMyProfileMW.prototype.render = function () {
    const {
        linksList,
        isLithiumSuccessful
    } = this.props;

    return (
        <Box
            fontSize='h3'>
            {linksList.map(
                (link, index) => {
                    // Remove first tab if lithium is down
                    if (!isLithiumSuccessful && index === 0) {
                        return null;
                    }

                    return <Box
                        width='100%'
                        paddingLeft={modal.PADDING_MW}
                        onClick={e => this.clickHandler(e, index)}>
                        <Flex
                            paddingY={space[5]}
                            paddingRight={modal.PADDING_MW}
                            lineHeight={1}
                            alignItems='center'
                            justifyContent='space-between'>
                            <Text>{link}</Text>
                            <Chevron direction='right' />
                        </Flex>
                        <Divider />
                    </Box>;
                }
            )}
        </Box>
    );
};


// Added by sephora-jsx-loader.js
EditMyProfileMW.prototype.path = 'RichProfile/EditMyProfile/EditMyProfileMW';
// Added by sephora-jsx-loader.js
Object.assign(EditMyProfileMW.prototype, require('./EditMyProfileMW.c.js'));
var originalDidMount = EditMyProfileMW.prototype.componentDidMount;
EditMyProfileMW.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: EditMyProfileMW');
if (originalDidMount) originalDidMount.apply(this);
if (EditMyProfileMW.prototype.ctrlr) EditMyProfileMW.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: EditMyProfileMW');
// Added by sephora-jsx-loader.js
EditMyProfileMW.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
EditMyProfileMW.prototype.class = 'EditMyProfileMW';
// Added by sephora-jsx-loader.js
EditMyProfileMW.prototype.getInitialState = function() {
    EditMyProfileMW.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
EditMyProfileMW.prototype.render = wrapComponentRender(EditMyProfileMW.prototype.render);
// Added by sephora-jsx-loader.js
var EditMyProfileMWClass = React.createClass(EditMyProfileMW.prototype);
// Added by sephora-jsx-loader.js
EditMyProfileMWClass.prototype.classRef = EditMyProfileMWClass;
// Added by sephora-jsx-loader.js
Object.assign(EditMyProfileMWClass, EditMyProfileMW);
// Added by sephora-jsx-loader.js
module.exports = EditMyProfileMWClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/EditMyProfile/EditMyProfileMW/EditMyProfileMW.jsx