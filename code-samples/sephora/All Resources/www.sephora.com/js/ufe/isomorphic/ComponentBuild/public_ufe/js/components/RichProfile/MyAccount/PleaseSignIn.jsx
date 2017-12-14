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
    Sephora.Util.InflatorComps.Comps['PleaseSignIn'] = function PleaseSignIn(){
        return PleaseSignInClass;
    }
}
const space = require('style').space;
const Link = require('components/Link/Link');
const Text = require('components/Text/Text');

function PleaseSignIn() {}

PleaseSignIn.prototype.render = function () {
    return (
        <Text
            is='h2'
            fontSize='h3'
            marginY={space[5]}>
            Please
            {' '}
            <Link
                primary={true}
                onClick={this.signInHandler}>
                sign in
            </Link>
            {' '}
            to review this section.
        </Text>
    );
};


// Added by sephora-jsx-loader.js
PleaseSignIn.prototype.path = 'RichProfile/MyAccount';
// Added by sephora-jsx-loader.js
Object.assign(PleaseSignIn.prototype, require('./PleaseSignIn.c.js'));
var originalDidMount = PleaseSignIn.prototype.componentDidMount;
PleaseSignIn.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PleaseSignIn');
if (originalDidMount) originalDidMount.apply(this);
if (PleaseSignIn.prototype.ctrlr) PleaseSignIn.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PleaseSignIn');
// Added by sephora-jsx-loader.js
PleaseSignIn.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PleaseSignIn.prototype.class = 'PleaseSignIn';
// Added by sephora-jsx-loader.js
PleaseSignIn.prototype.getInitialState = function() {
    PleaseSignIn.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PleaseSignIn.prototype.render = wrapComponentRender(PleaseSignIn.prototype.render);
// Added by sephora-jsx-loader.js
var PleaseSignInClass = React.createClass(PleaseSignIn.prototype);
// Added by sephora-jsx-loader.js
PleaseSignInClass.prototype.classRef = PleaseSignInClass;
// Added by sephora-jsx-loader.js
Object.assign(PleaseSignInClass, PleaseSignIn);
// Added by sephora-jsx-loader.js
module.exports = PleaseSignInClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/MyAccount/PleaseSignIn.jsx