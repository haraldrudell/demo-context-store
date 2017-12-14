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
    Sephora.Util.InflatorComps.Comps['FindInStoreModal'] = function FindInStoreModal(){
        return FindInStoreModalClass;
    }
}
const { measure, modal, space } = require('style');
const { Box, Grid, Text } = require('components/display');
const Modal = require('components/Modal/Modal');
const Link = require('components/Link/Link');
const Divider = require('components/Divider/Divider');
const InputZip = require('components/Inputs/InputZip/InputZip');
const Label = require('components/Inputs/Label/Label');
const Select = require('components/Inputs/Select/Select');
const ProductImage = require('components/Product/ProductImage/ProductImage');
const ButtonPrimary = require('components/Button/ButtonPrimary');
const ButtonOutline = require('components/Button/ButtonOutline');
const LocaleUtils = require('utils/LanguageLocale');
const FindInStoreAddress = require('../FindInStoreAddress/FindInStoreAddress');
const ProductVariation = require('components/Product/ProductVariation/ProductVariation');
const SizeAndItemNumber = require('components/Product/SizeAndItemNumber/SizeAndItemNumber');
const IMAGE_SIZES = require('utils/BCC').IMAGE_SIZES;
const DISTANCE = {
    US: {
        Values: [5, 10, 25, 50, 100],
        Unit: 'mile'
    },
    CA: {
        Values: [10, 25, 50, 100, 150],
        Unit: 'kilometer'
    }
};

const FindInStoreModal = function () {
    this.state = {
        inStock: false,
        zipCode: this.props.zipCode || null,
        showResult: this.props.showResult || false,
        searchedDistance: null,
        storeMessage: null,
        currentPage: 1,
        storesToShow: []
    };
    this.storeZipCode = null;
    this.totalStores = 0;
    this.storeList = [];
};

FindInStoreModal.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const product = this.props.currentProduct;
    const sku = product.currentSku || product;
    let isCanada = LocaleUtils.isCanada() ? true : false;
    let defaultDistance;
    let distanceUnit;
    let distanceValues;
    let index;
    if (isCanada) {
        distanceUnit = DISTANCE.CA.Unit;
        distanceValues = DISTANCE.CA.Values;
        index = this.props.zipCode ? DISTANCE.CA.Values.length - 1 : 0;
        defaultDistance = DISTANCE.CA.Values[index];
    } else {
        distanceUnit = DISTANCE.US.Unit;
        distanceValues = DISTANCE.US.Values;
        index = this.props.zipCode ? DISTANCE.US.Values.length - 1 : 0;
        defaultDistance = DISTANCE.US.Values[index];

    }

    let searched = this.state.searchedDistance || defaultDistance;
    let isShowMore = this.shouldShowMoreStores();

    return (<Modal
            open={this.props.isOpen}
            onDismiss={this.requestClose}
            width={modal.WIDTH.MD}>
            <Modal.Header>
                <Modal.Title>
                    Find in a Sephora store
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Grid
                    gutter={space[4]}
                    marginBottom={isMobile ? space[4] : space[6]}>
                    <Grid.Cell
                        width='fit'>
                        <ProductImage
                            skuImages={sku.skuImages}
                            size={IMAGE_SIZES[97]} />
                    </Grid.Cell>
                    <Grid.Cell
                        width='fill'
                        lineHeight={2}>
                        <Box
                            textTransform='uppercase'
                            fontWeight={700}
                            data-at={Sephora.debug.dataAt('fis_sku_brand')}>
                            {product.brand ? product.brand.displayName : product.brandName}
                        </Box>
                        <Box
                            data-at={Sephora.debug.dataAt('fis_sku_name')}>
                            {product.displayName}
                        </Box>
                        <SizeAndItemNumber
                            sku={sku}
                            fontSize='h5'
                            marginTop={space[2]}
                            lineHeight={2} />
                        <ProductVariation
                            product={product}
                            sku={sku}
                            fontSize='h5'
                            marginTop={space[1]}
                            data-at={Sephora.debug.dataAt('fis_sku_var')} />
                    </Grid.Cell>
                </Grid>
                {isMobile &&
                    <Divider
                        marginX={-modal.PADDING_MW}
                        marginBottom={space[4]}
                        height={space[2]} />
                }
                <Grid
                    gutter={space[3]}>
                    <Grid.Cell width='40%'>
                        <Label>{isCanada ? 'Postal' : 'ZIP'} code</Label>
                    </Grid.Cell>
                    <Grid.Cell width='40%'>
                        <Label>Within</Label>
                    </Grid.Cell>
                </Grid>
                <Grid
                    is='form'
                    method='post'
                    onSubmit={(e) => this.handleSubmit(e, searched)}
                    gutter={space[3]}>
                    <Grid.Cell
                        width='40%'>
                        <InputZip
                            placeholder={`e.g., ${isCanada ? 'M5B 2H1' : '90210'}`}
                            noMargin={true}
                            value={this.state.zipCode}
                            ref={(c) => {
                                if (c !== null) {
                                    this.storeZipCode = c;
                                }
                            }} />
                    </Grid.Cell>
                    <Grid.Cell
                        width='40%'>
                        <Select
                            noMargin={true}
                            name='distance'
                            value={searched}
                            onChange={this.handleDistanceSelect}>
                            {distanceValues.map((name, idx) =>
                                <option key={idx} value={name}>
                                    {name} {' ' + distanceUnit}s
                                </option>
                            )}
                        </Select>
                    </Grid.Cell>
                    <Grid.Cell
                        width='20%'>
                        <ButtonPrimary
                            type='submit'
                            block={true}>
                            FIND
                        </ButtonPrimary>
                    </Grid.Cell>
                </Grid>
                {this.state.showResult &&
                    <Box
                        marginTop={space[6]}
                        lineHeight={2}>
                        {this.state.inStock &&
                            <div>
                                <Text
                                    is='h3'
                                    fontWeight={700}>
                                    In Stock
                                </Text>
                                <Text
                                    is='p'
                                    marginTop={space[1]}
                                    marginBottom={space[4]}>
                                    {this.state.storeMessage}
                                </Text>
                                {this.state.storesToShow &&
                                    this.state.storesToShow.map((store, idx) =>
                                    <div>
                                        {idx > 0 &&
                                            <Divider marginY={space[4]} />
                                        }
                                        <Grid>
                                            <Grid.Cell
                                                width='2em'
                                                fontWeight={700}
                                                textAlign='right'
                                                paddingRight='.5em'>
                                                {idx + 1}.
                                            </Grid.Cell>
                                            <Grid.Cell
                                                width='fill'>
                                                <FindInStoreAddress
                                                    {...store} />
                                            </Grid.Cell>
                                            <Grid.Cell
                                                width='fit'
                                                paddingLeft={space[3]}>
                                                <Link
                                                    primary={true}
                                                    padding={space[2]}
                                                    margin={-space[2]}
                                                    onClick={() => this.showMap(product,
                                                        store, this.state.zipCode,
                                                        this.state.searchedDistance,
                                                        this.state.storesToShow)}>
                                                    View map
                                                </Link>
                                            </Grid.Cell>
                                        </Grid>
                                    </div>
                                )}
                            </div>
                        }
                        {isShowMore &&
                            <div>
                                <Divider marginY={space[4]} />
                                <ButtonOutline
                                    block={true}
                                    maxWidth='22em'
                                    marginX='auto'
                                    onClick={this.showMoreStores}>
                                    Show more
                                </ButtonOutline>
                            </div>
                        }
                        {this.state.inStock ||
                            <Text
                                is='p'
                                color='red'
                                lineHeight={2}
                                maxWidth={measure.BASE}>
                                We’re sorry, this item is not available
                                within {searched + ' ' + distanceUnit}s of
                                your selected ZIP/Postal code.
                            </Text>
                        }
                    </Box>
                }
            </Modal.Body>
        </Modal>
    );
};


// Added by sephora-jsx-loader.js
FindInStoreModal.prototype.path = 'GlobalModals/FindInStore/FindInStoreModal';
// Added by sephora-jsx-loader.js
Object.assign(FindInStoreModal.prototype, require('./FindInStoreModal.c.js'));
var originalDidMount = FindInStoreModal.prototype.componentDidMount;
FindInStoreModal.prototype.componentDidMount = function(){
//console.log('Non-root componentDidMount Fired: FindInStoreModal');
if (originalDidMount) originalDidMount.apply(this);
if (FindInStoreModal.prototype.ctrlr) FindInStoreModal.prototype.ctrlr.apply(this, this.props.ctrlrArgs);
};
//console.log('Applied non-root componentDidMount: FindInStoreModal');
// Added by sephora-jsx-loader.js
FindInStoreModal.prototype.hasCtrlr = 'true';
// Added by sephora-jsx-loader.js
FindInStoreModal.prototype.class = 'FindInStoreModal';
// Added by sephora-jsx-loader.js
FindInStoreModal.prototype.getInitialState = function() {
    FindInStoreModal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
FindInStoreModal.prototype.render = wrapComponentRender(FindInStoreModal.prototype.render);
// Added by sephora-jsx-loader.js
var FindInStoreModalClass = React.createClass(FindInStoreModal.prototype);
// Added by sephora-jsx-loader.js
FindInStoreModalClass.prototype.classRef = FindInStoreModalClass;
// Added by sephora-jsx-loader.js
Object.assign(FindInStoreModalClass, FindInStoreModal);
// Added by sephora-jsx-loader.js
module.exports = FindInStoreModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/GlobalModals/FindInStore/FindInStoreModal/FindInStoreModal.jsx