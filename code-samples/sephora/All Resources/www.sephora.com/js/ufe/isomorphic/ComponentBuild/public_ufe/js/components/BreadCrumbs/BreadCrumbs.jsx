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
    Sephora.Util.InflatorComps.Comps['BreadCrumbs'] = function BreadCrumbs(){
        return BreadCrumbsClass;
    }
}
const { space } = require('style');
const Link = require('components/Link/Link');
const Text = require('components/Text/Text');
const Flex = require('components/Flex/Flex');
const Chevron = require('components/Chevron/Chevron');

let BreadCrumbs = function () {
    return null;
};

BreadCrumbs.prototype.getInitialState = BreadCrumbs;

BreadCrumbs.prototype.render = function () {
    const {
        items,
        ...props
    } = this.props;

    const crumbs = items && items.map((item, index) => {
        let component;
        if (index < items.length - 1) {
            component = (
                        <Flex
                            alignItems='center'>
                            <Link
                                href={item.href}
                                padding={space[2]}
                                margin={-space[2]}>
                                {item.name}
                            </Link>
                            <Chevron
                                direction='right'
                                fontSize='.5em'
                                marginX={space[2]} />
                        </Flex>
                    );
        } else {
            if (item.href) {
                component = (<Link
                                 href={item.href}
                                 padding={space[2]}
                                 margin={-space[2]}
                                 color='gray'>
                                 {item.name}
                             </Link>);
            } else {
                component = (
                    <Text color='gray'>
                        {item.name}
                    </Text>
                );
            }
        }

        return component;
    });

    return (
        <Flex
            fontSize='h5'
            paddingY={space[4]}
            alignItems='center'
            textTransform='lowercase'>
            {crumbs}
        </Flex>
    );
};


// Added by sephora-jsx-loader.js
BreadCrumbs.prototype.path = 'BreadCrumbs';
// Added by sephora-jsx-loader.js
BreadCrumbs.prototype.class = 'BreadCrumbs';
// Added by sephora-jsx-loader.js
BreadCrumbs.prototype.getInitialState = function() {
    BreadCrumbs.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
BreadCrumbs.prototype.render = wrapComponentRender(BreadCrumbs.prototype.render);
// Added by sephora-jsx-loader.js
var BreadCrumbsClass = React.createClass(BreadCrumbs.prototype);
// Added by sephora-jsx-loader.js
BreadCrumbsClass.prototype.classRef = BreadCrumbsClass;
// Added by sephora-jsx-loader.js
Object.assign(BreadCrumbsClass, BreadCrumbs);
// Added by sephora-jsx-loader.js
module.exports = BreadCrumbsClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/BreadCrumbs/BreadCrumbs.jsx