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
    Sephora.Util.InflatorComps.Comps['PleaseSignInProfile'] = function PleaseSignInProfile(){
        return PleaseSignInProfileClass;
    }
}
const space = require('style').space;
const Link = require('components/Link/Link');
const Text = require('components/Text/Text');
const Container = require('components/Container/Container');

function PleaseSignInProfile() {
    this.state = {
        showPleaseSignInBlock: true 
    };
}

PleaseSignInProfile.prototype.render = function () {
    return (
        <Container
            paddingY={space[5]}>
            { this.state.showPleaseSignInBlock &&
                <Text
                    is='h2'
                    fontSize='h3'
                    marginY={space[5]}>
                    Please&nbsp;
                    <Link
                        primary={true}
                        onClick={this.signInHandler}>
                        sign in
                    </Link>
                    &nbsp;to view this page.
                </Text>
            }
        </Container>
    );
};


// Added by sephora-jsx-loader.js
PleaseSignInProfile.prototype.path = 'RichProfile/UserProfile';
// Added by sephora-jsx-loader.js
Object.assign(PleaseSignInProfile.prototype, require('./PleaseSignInProfile.c.js'));
var originalDidMount = PleaseSignInProfile.prototype.componentDidMount;
PleaseSignInProfile.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: PleaseSignInProfile');
if (originalDidMount) originalDidMount.apply(this);
if (PleaseSignInProfile.prototype.ctrlr) PleaseSignInProfile.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: PleaseSignInProfile');
// Added by sephora-jsx-loader.js
PleaseSignInProfile.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
PleaseSignInProfile.prototype.class = 'PleaseSignInProfile';
// Added by sephora-jsx-loader.js
PleaseSignInProfile.prototype.getInitialState = function() {
    PleaseSignInProfile.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
PleaseSignInProfile.prototype.render = wrapComponentRender(PleaseSignInProfile.prototype.render);
// Added by sephora-jsx-loader.js
var PleaseSignInProfileClass = React.createClass(PleaseSignInProfile.prototype);
// Added by sephora-jsx-loader.js
PleaseSignInProfileClass.prototype.classRef = PleaseSignInProfileClass;
// Added by sephora-jsx-loader.js
Object.assign(PleaseSignInProfileClass, PleaseSignInProfile);
// Added by sephora-jsx-loader.js
module.exports = PleaseSignInProfileClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/RichProfile/UserProfile/PleaseSignInProfile.jsx