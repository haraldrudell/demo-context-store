// Added by sephora-jsx-loader.js
'use strict'
// Added by sephora-jsx-loader.js
var React = require('react');

// Added by sephora-jsx-loader.js
var wrapComponentRenderModule = require('utils/framework/wrapComponentRender');

// Added by sephora-jsx-loader.js
var wrapComponentRender = require('utils/framework/wrapComponentRender').wrapComponentRender;

const Base = require('components/Base/Base');
const BccStyleWrapper = require('components/Bcc/BccStyleWrapper/BccStyleWrapper');

// TODO: Move empty to components folder
const Empty = require('pages/Empty/Empty');

const TestTarget = function () {
    this.state = {
        displayComponent: Empty,
        updateProps: null,
        componentHidden: null
    };
};

TestTarget.prototype.asyncRender = 'TestTarget';

TestTarget.prototype.propTypes = {
    testName: React.PropTypes.string.isRequired,
    testComponent: React.PropTypes.string.isRequired
};

TestTarget.prototype.getDefaultProps = function () {
    return {
        testEnabled: true
    };
};

TestTarget.prototype.render = function () {
    const {
        is,
        style,
        testComponent,
        testName,
        testEnabled,
        index,
        isTopNav,
        isBcc,
        ...defaultProps
    } = this.props;

    let componentProps;

    if (isBcc) {

        /* BCC component renders with state.updateProps in swapping tests, and in the case of
        show & hide tests the component renders with its original props. */
        componentProps = this.state.updateProps ? this.state.updateProps : defaultProps;
    } else {
        componentProps = this.state.updateProps ? Object.assign({}, defaultProps,
        this.state.updateProps) : defaultProps;
    }

    let Component = this.state.displayComponent ?
        <this.state.displayComponent {...componentProps} /> : null;

    if (isBcc && !this.state.componentHidden) {
        Component = <BccStyleWrapper
            key={index}
            isTopNav={isTopNav}
            customStyle={componentProps.styleList}>
            {Component}
        </BccStyleWrapper>;
    }

    return (
        <Base
            is={is}
            _css={style}>
            {Component}
        </Base>
    );
};


// Added by sephora-jsx-loader.js
TestTarget.prototype.path = 'TestTarget';
// Added by sephora-jsx-loader.js
Object.assign(TestTarget.prototype, require('./TestTarget.c.js'));
var originalDidMount = TestTarget.prototype.componentDidMount;
TestTarget.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: TestTarget');
if (originalDidMount) originalDidMount.apply(this);
if (TestTarget.prototype.ctrlr) TestTarget.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: TestTarget');
// Added by sephora-jsx-loader.js
TestTarget.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
TestTarget.prototype.class = 'TestTarget';
// Added by sephora-jsx-loader.js
TestTarget.prototype.getInitialState = function() {
    TestTarget.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
TestTarget.prototype.render = wrapComponentRender(TestTarget.prototype.render);
// Added by sephora-jsx-loader.js
var TestTargetClass = React.createClass(TestTarget.prototype);
// Added by sephora-jsx-loader.js
TestTargetClass.prototype.classRef = TestTargetClass;
// Added by sephora-jsx-loader.js
Object.assign(TestTargetClass, TestTarget);
// Added by sephora-jsx-loader.js
module.exports = TestTargetClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/TestTarget/TestTarget.jsx