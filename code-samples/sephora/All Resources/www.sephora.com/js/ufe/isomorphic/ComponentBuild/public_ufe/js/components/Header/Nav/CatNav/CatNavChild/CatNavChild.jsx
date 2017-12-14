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
    Sephora.Util.InflatorComps.Comps['CatNavChild'] = function CatNavChild(){
        return CatNavChildClass;
    }
}
const { space } = require('style');
const Grid = require('components/Grid/Grid');
const CatNavGroup = require('./CatNavGroup/CatNavGroup');
const CatNavHeading = require('./CatNavHeading/CatNavHeading');
const HamburgerItem = require('components/Header/Nav/Hamburger/HamburgerItem/HamburgerItem');
const BccComponentList = require('components/Bcc/BccComponentList/BccComponentList');
const UrlUtils = require('utils/Url');

const CatNavChild = function () {

    // state.activeChild is used only in MW to selectively render selected inner-category.
    this.state = {
        activeChild: null
    };
};

CatNavChild.prototype.render = function () {
    let category = this.props.openCategory;
    let content = typeof category.content !== 'undefined' ? category.content : null;
    let trackNavClick = this.props.trackNavClick;

    let sortedLinks = content && {
        justArrived: category.content.justArrivedTargetURL,
        bestseller: category.content.bestsellersTargetURL
    };

    let filteredCategory = columnNumber =>
        category && category.childCategories.filter(category =>
            category.megaNavColumn === columnNumber ? category : null
        ).map((child, index) =>
            <CatNavGroup
                key={index}
                child={child}
                anaCategoryPath={category.displayName}
                trackNavClick={this.props.trackNavClick} />);

    let fourthColumnComps = category && category.content && category.content.region1
        ? category.content.region1 : null;

    return (
        Sephora.isDesktop() ?
            <Grid
                gutter={space[5]}
                minHeight='100%'>
                <Grid.Cell width={1 / 4}>
                    {
                        (sortedLinks && sortedLinks.justArrived) &&
                        <CatNavHeading
                            href={UrlUtils.getLink(sortedLinks.justArrived)}
                            onClick={() => trackNavClick(
                                ['top nav', 'shop', category.displayName, 'just arrived']
                            )}>
                            Just Arrived
                        </CatNavHeading>
                    }
                    {
                        (sortedLinks && sortedLinks.bestseller) &&
                        <CatNavHeading
                            href={UrlUtils.getLink(sortedLinks.bestseller)}
                            onClick={() => trackNavClick(
                                ['top nav', 'shop', category.displayName, 'bestsellers']
                            )}>
                            Bestsellers
                        </CatNavHeading>
                    }
                    {filteredCategory(1)}
                </Grid.Cell>
                <Grid.Cell width={1 / 4}>{filteredCategory(2)}</Grid.Cell>
                <Grid.Cell width={1 / 4}>{filteredCategory(3)}</Grid.Cell>
                <Grid.Cell width={1 / 4}
                    display='flex'
                    flexDirection='column'>
                    {fourthColumnComps &&
                        <BccComponentList
                            items={fourthColumnComps}

                            //Hard code context because bcc links don't know about their parents
                            contextualParentTitles={['top nav', 'shop', category.displayName]}
                            isTopNav={true}
                            nested={true} />
                    }
                    {category && category.megaNavMarketingBanner &&
                        <BccComponentList
                            marginTop='auto'
                            paddingTop={space[4]}
                            items={category.megaNavMarketingBanner}
                            isTopNav={true}
                            contextualParentTitles={['top nav', 'shop', category.displayName]}
                            nested={true} />
                    }
                </Grid.Cell>
            </Grid>
            : <HamburgerItem>
                <HamburgerItem.Header
                    href={UrlUtils.getLink(category.targetUrl)}
                    title={['top nav', 'shop', category.displayName]}>
                    {category.displayName}
                </HamburgerItem.Header>
                {
                    (sortedLinks && sortedLinks.justArrived) &&
                    <HamburgerItem.Title
                    title={['shop', category.displayName, 'Just Arrived']}
                    href={UrlUtils.getLink(sortedLinks.justArrived)}>
                        Just Arrived
                    </HamburgerItem.Title>
                }
                {
                    (sortedLinks && sortedLinks.bestseller) &&
                    <HamburgerItem.Title
                    title={['shop', category.displayName, 'Bestsellers']}
                    href={UrlUtils.getLink(sortedLinks.bestseller)}>
                        Bestsellers
                    </HamburgerItem.Title>
                }
                {
                    category.hasChildCategories &&
                    category.childCategories.map((child, index) =>
                        <HamburgerItem.Title
                            key={index}
                            href={!child.hasChildCategories ?
                                UrlUtils.getLink(child.targetUrl) : null}
                            title={['shop', category.displayName, child.displayName]}
                            callback={() => this.setState({
                                activeChild: child
                            })}>
                            {child.displayName}
                        </HamburgerItem.Title>
                    )
                }
                <HamburgerItem.Menu>
                    {
                        this.state.activeChild &&
                        <div>
                            <HamburgerItem.Header
                                href={UrlUtils.getLink(this.state.activeChild.targetUrl)}>
                                {this.state.activeChild.displayName}
                            </HamburgerItem.Header>
                            {
                                this.state.activeChild.hasChildCategories &&
                                this.state.activeChild.childCategories.map((innerChild, index) =>
                                    <HamburgerItem.Title
                                        key={index}
                                        href={UrlUtils.getLink(innerChild.targetUrl)}
                                        title={[
                                            'shop',
                                            category.displayName,
                                            this.state.activeChild.displayName,
                                            innerChild.displayName
                                        ]}>
                                        {innerChild.displayName}
                                    </HamburgerItem.Title>
                                )
                            }
                        </div>
                    }
                </HamburgerItem.Menu>
            </HamburgerItem>
    );
};


// Added by sephora-jsx-loader.js
CatNavChild.prototype.path = 'Header/Nav/CatNav/CatNavChild';
// Added by sephora-jsx-loader.js
CatNavChild.prototype.class = 'CatNavChild';
// Added by sephora-jsx-loader.js
CatNavChild.prototype.getInitialState = function() {
    CatNavChild.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatNavChild.prototype.render = wrapComponentRender(CatNavChild.prototype.render);
// Added by sephora-jsx-loader.js
var CatNavChildClass = React.createClass(CatNavChild.prototype);
// Added by sephora-jsx-loader.js
CatNavChildClass.prototype.classRef = CatNavChildClass;
// Added by sephora-jsx-loader.js
Object.assign(CatNavChildClass, CatNavChild);
// Added by sephora-jsx-loader.js
module.exports = CatNavChildClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Header/Nav/CatNav/CatNavChild/CatNavChild.jsx