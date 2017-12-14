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
    Sephora.Util.InflatorComps.Comps['CatNavFS'] = function CatNavFS(){
        return CatNavFSClass;
    }
}
const { space } = require('style');
const Grid = require('components/Grid/Grid');

const CatNavFS = function () { };

const CatNavParent = require('components/Header/Nav/CatNav/CatNavParent/CatNavParent');
const CatNavChild = require('components/Header/Nav/CatNav/CatNavChild/CatNavChild');

CatNavFS.prototype.render = function () {
    let {
        categories,
        openCategory,
        categoryMenu,
        changeCategory,
        width,
        trackNavClick
    } = this.props;

    return (
        <Grid>
            <Grid.Cell
                width={width}
                paddingY={space[4]}
                id='catnav-parent'
                onMouseLeave={this.handleMouseLeaveMenu}>
                {
                    categories && categories.map((category, index) =>
                        <CatNavParent
                        key={index}
                        category={category}
                        openCategory={openCategory}
                        handleSwitchMenu={this.handleSwitchMenu}
                        index={index}
                        trackNavClick={trackNavClick}/>
                    )
                }
                {
                    categoryMenu && categoryMenu.map((category, index) =>
                        <CatNavParent
                        key={index}
                        bccCategory={category}
                        changeCategory={changeCategory}
                        trackNavClick={trackNavClick}/>
                    )
                }
            </Grid.Cell>
            {openCategory && openCategory.hasChildCategories &&
                <Grid.Cell
                    width='fill'
                    padding={space[5]}
                    borderLeft={1}
                    borderColor='lightGray'>
                    <CatNavChild openCategory={openCategory} trackNavClick={trackNavClick}/>
                </Grid.Cell>
            }
        </Grid>
    );
};


// Added by sephora-jsx-loader.js
CatNavFS.prototype.path = 'Header/Nav/CatNav/CatNavFS';
// Added by sephora-jsx-loader.js
Object.assign(CatNavFS.prototype, require('./CatNavFS.c.js'));
var originalDidMount = CatNavFS.prototype.componentDidMount;
CatNavFS.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: CatNavFS');
if (originalDidMount) originalDidMount.apply(this);
if (CatNavFS.prototype.ctrlr) CatNavFS.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: CatNavFS');
// Added by sephora-jsx-loader.js
CatNavFS.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
CatNavFS.prototype.class = 'CatNavFS';
// Added by sephora-jsx-loader.js
CatNavFS.prototype.getInitialState = function() {
    CatNavFS.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatNavFS.prototype.render = wrapComponentRender(CatNavFS.prototype.render);
// Added by sephora-jsx-loader.js
var CatNavFSClass = React.createClass(CatNavFS.prototype);
// Added by sephora-jsx-loader.js
CatNavFSClass.prototype.classRef = CatNavFSClass;
// Added by sephora-jsx-loader.js
Object.assign(CatNavFSClass, CatNavFS);
// Added by sephora-jsx-loader.js
module.exports = CatNavFSClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/CatNav/CatNavFS/CatNavFS.jsx