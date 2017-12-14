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
    Sephora.Util.InflatorComps.Comps['GalleryFilters'] = function GalleryFilters(){
        return GalleryFiltersClass;
    }
}
/* eslint-disable max-len */
const { forms, modal, space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Link = require('components/Link/Link');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const Modal = require('components/Modal/Modal');
const Divider = require('components/Divider/Divider');
const Filters = require('utils/Filters');
const skuUtils = require('utils/Sku');
const Filter = require('components/ProductPage/Filter/Filter');

const GalleryFilters = function () {
    this.state = {
        selectedFilters: [],
        filterComponents: {},
        hasColorFilter: (this.props.variationType === skuUtils.skuVariationType.COLOR)
            && (this.props.regularChildSkus && this.props.regularChildSkus.length > 0)
    };
};

GalleryFilters.prototype.render = function () {
    return !this.state.hasColorFilter ? null :
        Sephora.isMobile() ? this.getMobile() : this.getDesktop();
};

GalleryFilters.prototype.getMobile = function () {
    let {
        regularChildSkus = [],
        onSaleChildSkus = []
    } = this.props;
    let skus = regularChildSkus.concat(onSaleChildSkus);
    return (
        <div>
            <Link
                padding={space[3]}
                margin={-space[3]}
                arrowDirection='down'
                onClick={() => this.setState({
                    isModalOpen: true
                })}>
                View by color {this.getSkuFilterCount()}
            </Link>
            <Modal
                open={this.state.isModalOpen}
                isFixedHeader={true}
                onDismiss={() => this.setState({
                    isModalOpen: false
                })}>
                <Modal.Header>
                    <Modal.Title>
                        View by color
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        paddingTop: 0,
                        paddingBottom: forms.HEIGHT + (modal.PADDING_MW * 2) + space[4]
                    }}>
                    {this.getSkuFilters(skus)}
                </Modal.Body>
                <Modal.Footer
                    isFixed={true}>
                    {this.getButtons()}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

GalleryFilters.prototype.getDesktop = function () {
    let {
        regularChildSkus = [],
        onSaleChildSkus = []
    } = this.props;

    let skus = regularChildSkus.concat(onSaleChildSkus);

    return (
        <Box fontSize='h3'>
            {this.getSkuFilters(skus)}
        </Box>
    );
};

GalleryFilters.prototype.getButtons = function () {
    let isMobile = Sephora.isMobile();
    return (
        <Grid
            fit={true}
            gutter={isMobile ? space[4] : space[2]}
            marginTop={!isMobile ? space[3] : null}>
            <Grid.Cell>
                <ButtonOutline
                    block={true}
                    size={!isMobile ? 'sm' : null}
                    onClick={() => {
                        this.onResetFilter();
                    }}>
                    Reset
                </ButtonOutline>
            </Grid.Cell>
            <Grid.Cell>
                <ButtonPrimary
                    block={true}
                    size={!isMobile ? 'sm' : null}
                    onClick={() => this.applyGalleryFilters()}>
                    Done
                </ButtonPrimary>
            </Grid.Cell>
        </Grid>
    );
};

GalleryFilters.prototype.getSkuFilters = function (skus) {
    const isDesktop = Sephora.isDesktop();
    let skuList = this.skuList = Filters.createSkuAggregatedList(skus);
    let count = skuList.values.length;
    let columns = count > 15 ? 3 : count > 7 ? 2 : 1;
    return (
        <Filter
            isRightDropdown={true}
            width={isDesktop ? columns * 225 : null}
            columns={isDesktop ? columns : 1}
            type={Filters.TYPES.CHECKBOX}
            ref={filterComp =>
                this.state.filterComponents = filterComp}
            labels={skuList.labels}
            valueImages={skuList.images}
            selected={this.state.selectedFilters}
            buttons={this.getButtons()}
            values={skuList.values}>
            {isDesktop &&
                <Text>
                    View by color {this.getSkuFilterCount()}
                </Text>
            }
        </Filter>
    );
};

GalleryFilters.prototype.getSkuFilterCount = function () {
    let filtersCount = this.getFiltersCount();
    return <b>({filtersCount || 'All'})</b>;
};


// Added by sephora-jsx-loader.js
GalleryFilters.prototype.path = 'ProductPage/ExploreThisProduct/GalleryFilters';
// Added by sephora-jsx-loader.js
Object.assign(GalleryFilters.prototype, require('./GalleryFilters.c.js'));
var originalDidMount = GalleryFilters.prototype.componentDidMount;
GalleryFilters.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: GalleryFilters');
if (originalDidMount) originalDidMount.apply(this);
if (GalleryFilters.prototype.ctrlr) GalleryFilters.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: GalleryFilters');
// Added by sephora-jsx-loader.js
GalleryFilters.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
GalleryFilters.prototype.class = 'GalleryFilters';
// Added by sephora-jsx-loader.js
GalleryFilters.prototype.getInitialState = function() {
    GalleryFilters.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
GalleryFilters.prototype.render = wrapComponentRender(GalleryFilters.prototype.render);
// Added by sephora-jsx-loader.js
var GalleryFiltersClass = React.createClass(GalleryFilters.prototype);
// Added by sephora-jsx-loader.js
GalleryFiltersClass.prototype.classRef = GalleryFiltersClass;
// Added by sephora-jsx-loader.js
Object.assign(GalleryFiltersClass, GalleryFilters);
// Added by sephora-jsx-loader.js
module.exports = GalleryFiltersClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/ProductPage/ExploreThisProduct/GalleryFilters/GalleryFilters.jsx