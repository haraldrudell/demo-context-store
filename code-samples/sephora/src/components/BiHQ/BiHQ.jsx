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
    Sephora.Util.InflatorComps.Comps['BiHQ'] = function BiHQ(){
        return BiHQClass;
    }
}
const BiTopBar = require('components/BiTopBar/BiTopBar');
const BiWelcomeCard = require('components/BiTopBar/BiWelcomeCard/BiWelcomeCard');
const BiInfoCard = require('components/BiTopBar/BiInfoCard/BiInfoCard');
const Container = require('components/Container/Container');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');

const BiHQ = function () {
    this.state = {
        user: null,
        isUserBi: false,
        isAnonymous: true,
        contentData: null
    };
};

BiHQ.prototype.render = function () {
    let biSection;
    let contentData = this.state.contentData;

    if (!(this.state.isAnonymous || this.state.isUserBi)) {
        biSection = <BiWelcomeCard joinNowCTA />;
    } else if (!this.state.isAnonymous && this.state.isUserBi) {
        biSection = <BiInfoCard isShowViewActivity user={this.state.user} />;
    } else {
        //if the user is anonymous
        biSection = <BiWelcomeCard joinNowCTA={false} />;
    }

    return (
        <div>
            {this.state.user &&
                <div>
                    <BiTopBar>
                        {biSection}
                    </BiTopBar>
                    <Container>
                        <BccComponentList
                            items={contentData} />
                    </Container>
                </div>
            }
        </div>
    );
};


// Added by sephora-jsx-loader.js
BiHQ.prototype.path = 'BiHQ';
// Added by sephora-jsx-loader.js
Object.assign(BiHQ.prototype, require('./BiHQ.c.js'));
var originalDidMount = BiHQ.prototype.componentDidMount;
BiHQ.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: BiHQ');
if (originalDidMount) originalDidMount.apply(this);
if (BiHQ.prototype.ctrlr) BiHQ.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: BiHQ');
// Added by sephora-jsx-loader.js
BiHQ.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
BiHQ.prototype.class = 'BiHQ';
// Added by sephora-jsx-loader.js
BiHQ.prototype.getInitialState = function() {
    BiHQ.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BiHQ.prototype.render = wrapComponentRender(BiHQ.prototype.render);
// Added by sephora-jsx-loader.js
var BiHQClass = React.createClass(BiHQ.prototype);
// Added by sephora-jsx-loader.js
BiHQClass.prototype.classRef = BiHQClass;
// Added by sephora-jsx-loader.js
Object.assign(BiHQClass, BiHQ);
// Added by sephora-jsx-loader.js
module.exports = BiHQClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BiHQ/BiHQ.jsx