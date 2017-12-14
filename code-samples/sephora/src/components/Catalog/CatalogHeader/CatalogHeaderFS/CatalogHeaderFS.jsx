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
    Sephora.Util.InflatorComps.Comps['CatalogHeaderFS'] = function CatalogHeaderFS(){
        return CatalogHeaderFSClass;
    }
}
const { colors, space } = require('style');
const { Box, Flex, Text } = require('components/display');
var ProductSort = require('../../ProductSort/ProductSort');

var CatalogHeaderFS = function () { };

CatalogHeaderFS.prototype.render = function () {
    return (
		<div>
			<Box
				marginBottom={space[5]}
				borderBottom={1}
				borderColor={colors.moonGray}>
				<Flex
					justifyContent='space-between'
					alignItems='flex-end'
					marginBottom={space[3]}>
					<Text
						is='h2'
						fontSize='h3'>
						{this.props.productsQuantity} Product results for {this.props.displayName}
					</Text>
				</Flex>
			</Box>
			<Flex
				alignItems='center'
				justifyContent='flex-end'
				marginBottom={space[5]}>
				<ProductSort></ProductSort>
			</Flex>
		</div>
    );
};


// Added by sephora-jsx-loader.js
CatalogHeaderFS.prototype.path = 'Catalog/CatalogHeader/CatalogHeaderFS';
// Added by sephora-jsx-loader.js
CatalogHeaderFS.prototype.class = 'CatalogHeaderFS';
// Added by sephora-jsx-loader.js
CatalogHeaderFS.prototype.getInitialState = function() {
    CatalogHeaderFS.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
CatalogHeaderFS.prototype.render = wrapComponentRender(CatalogHeaderFS.prototype.render);
// Added by sephora-jsx-loader.js
var CatalogHeaderFSClass = React.createClass(CatalogHeaderFS.prototype);
// Added by sephora-jsx-loader.js
CatalogHeaderFSClass.prototype.classRef = CatalogHeaderFSClass;
// Added by sephora-jsx-loader.js
Object.assign(CatalogHeaderFSClass, CatalogHeaderFS);
// Added by sephora-jsx-loader.js
module.exports = CatalogHeaderFSClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Catalog/CatalogHeader/CatalogHeaderFS/CatalogHeaderFS.jsx