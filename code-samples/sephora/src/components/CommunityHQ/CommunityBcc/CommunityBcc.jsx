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
    Sephora.Util.InflatorComps.Comps['CommunityBcc'] = function CommunityBcc(){
        return CommunityBccClass;
    }
}
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');

const CommunityBcc = function () {
    this.state = {
        contentData: null
    };
};

CommunityBcc.prototype.render = function () {
    return (
        <div>
            <BccComponentList items={this.state.contentData} />
        </div>
    );
};


// Added by sephora-jsx-loader.js
CommunityBcc.prototype.path = 'CommunityHQ/CommunityBcc';
// Added by sephora-jsx-loader.js
Object.assign(CommunityBcc.prototype, require('./CommunityBcc.c.js'));
var originalDidMount = CommunityBcc.prototype.componentDidMount;
CommunityBcc.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CommunityBcc');
if (originalDidMount) originalDidMount.apply(this);
if (CommunityBcc.prototype.ctrlr) CommunityBcc.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CommunityBcc');
// Added by sephora-jsx-loader.js
CommunityBcc.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CommunityBcc.prototype.class = 'CommunityBcc';
// Added by sephora-jsx-loader.js
CommunityBcc.prototype.getInitialState = function() {
    CommunityBcc.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CommunityBcc.prototype.render = wrapComponentRender(CommunityBcc.prototype.render);
// Added by sephora-jsx-loader.js
var CommunityBccClass = React.createClass(CommunityBcc.prototype);
// Added by sephora-jsx-loader.js
CommunityBccClass.prototype.classRef = CommunityBccClass;
// Added by sephora-jsx-loader.js
Object.assign(CommunityBccClass, CommunityBcc);
// Added by sephora-jsx-loader.js
module.exports = CommunityBccClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/CommunityHQ/CommunityBcc/CommunityBcc.jsx