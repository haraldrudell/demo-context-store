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
    Sephora.Util.InflatorComps.Comps['BiQualify'] = function BiQualify(){
        return BiQualifyClass;
    }
}
const { Text } = require('components/display');
const skuUtils = require('utils/Sku');
const userUtils = require('utils/User');
const Link = require('components/Link/Link');

const BiQualify = function () {
    this.state = {
        isUserAnonymous: true,
        isBiLevelQualifiedFor: false
    };
};

BiQualify.prototype.render = function () {
    let {
        currentSku,
        ...props
    } = this.props;

    //changes BI Qualification user message dependent on bi level of sku

    let userLabel = userUtils.displayBiStatus(currentSku.biExclusiveLevel.toUpperCase());
    let learnMoreUrl = '/about-beauty-insider/?tab=bi&mediaId=17500017';
    if (userLabel === userUtils.types.ROUGE) {
        learnMoreUrl = '/rouge';
    } else if (userLabel === userUtils.types.VIB) {
        learnMoreUrl = '/vib';
    }

    //changes interaction depending on user status for BI Qualification

    if (!this.state.isBiLevelQualifiedFor) {
        return (
            <Text
                is='p'
                lineHeight={2}
                {...props}>
                You must be a {userLabel} to qualify for this product.
                {' '}
                {this.state.isUserAnonymous ?
                    <span>
                        <Link
                            primary={true}
                            onClick={this.signInHandler}>
                            Sign in
                        </Link>
                        {' '} or {' '}
                    </span> :
                    (userUtils.isBI() ? null :
                        <span>
                            <Link
                                primary={true}
                                onClick={this.biRegisterHandler}>
                                Sign up
                            </Link>
                            {' '} or {' '}
                        </span>
                    )
                }
                <Link
                    primary={true}
                    href={learnMoreUrl}>
                    Learn more
                </Link>
            </Text>
        );
    } else {
        return null;
    }
};


// Added by sephora-jsx-loader.js
BiQualify.prototype.path = 'BiQualify';
// Added by sephora-jsx-loader.js
Object.assign(BiQualify.prototype, require('./BiQualify.c.js'));
var originalDidMount = BiQualify.prototype.componentDidMount;
BiQualify.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BiQualify');
if (originalDidMount) originalDidMount.apply(this);
if (BiQualify.prototype.ctrlr) BiQualify.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BiQualify');
// Added by sephora-jsx-loader.js
BiQualify.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BiQualify.prototype.class = 'BiQualify';
// Added by sephora-jsx-loader.js
BiQualify.prototype.getInitialState = function() {
    BiQualify.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiQualify.prototype.render = wrapComponentRender(BiQualify.prototype.render);
// Added by sephora-jsx-loader.js
var BiQualifyClass = React.createClass(BiQualify.prototype);
// Added by sephora-jsx-loader.js
BiQualifyClass.prototype.classRef = BiQualifyClass;
// Added by sephora-jsx-loader.js
Object.assign(BiQualifyClass, BiQualify);
// Added by sephora-jsx-loader.js
module.exports = BiQualifyClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiQualify/BiQualify.jsx