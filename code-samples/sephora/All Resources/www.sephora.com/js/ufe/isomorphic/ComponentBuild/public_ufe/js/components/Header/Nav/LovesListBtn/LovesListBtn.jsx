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
    Sephora.Util.InflatorComps.Comps['LovesListBtn'] = function LovesListBtn(){
        return LovesListBtnClass;
    }
}
const space = require('style').space;
const { Box } = require('components/display');
const IconLove = require('components/Icon/IconLove');
const Tooltip = require('components/Tooltip/Tooltip');

const LovesListBtn = function () {};

LovesListBtn.prototype.render = function () {
    const loveIcon =
        <Box
            padding={space[2]}
            lineHeight={0}>
            <IconLove fontSize={24} />
        </Box>;

    return (
        <Box
            href={Sephora.isThirdPartySite
                ? '//www.sephora.com/shopping-list'
                : '/shopping-list'}
            onClick={this.trackLoveClick}>
            {Sephora.isThirdPartySite ? loveIcon :
                <Tooltip
                    bottom={true}
                    title='Loves List'
                    fontSize='h5'>
                    {loveIcon}
                </Tooltip>
            }
        </Box>
    );
};


// Added by sephora-jsx-loader.js
LovesListBtn.prototype.path = 'Header/Nav/LovesListBtn';
// Added by sephora-jsx-loader.js
Object.assign(LovesListBtn.prototype, require('./LovesListBtn.c.js'));
var originalDidMount = LovesListBtn.prototype.componentDidMount;
LovesListBtn.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: LovesListBtn');
if (originalDidMount) originalDidMount.apply(this);
if (LovesListBtn.prototype.ctrlr) LovesListBtn.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: LovesListBtn');
// Added by sephora-jsx-loader.js
LovesListBtn.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
LovesListBtn.prototype.class = 'LovesListBtn';
// Added by sephora-jsx-loader.js
LovesListBtn.prototype.getInitialState = function() {
    LovesListBtn.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
LovesListBtn.prototype.render = wrapComponentRender(LovesListBtn.prototype.render);
// Added by sephora-jsx-loader.js
var LovesListBtnClass = React.createClass(LovesListBtn.prototype);
// Added by sephora-jsx-loader.js
LovesListBtnClass.prototype.classRef = LovesListBtnClass;
// Added by sephora-jsx-loader.js
Object.assign(LovesListBtnClass, LovesListBtn);
// Added by sephora-jsx-loader.js
module.exports = LovesListBtnClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/LovesListBtn/LovesListBtn.jsx