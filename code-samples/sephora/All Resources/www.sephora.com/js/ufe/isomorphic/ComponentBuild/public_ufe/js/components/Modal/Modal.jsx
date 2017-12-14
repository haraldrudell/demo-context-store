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
    Sephora.Util.InflatorComps.Comps['Modal'] = function Modal(){
        return ModalClass;
    }
}
const css = require('glamor').css;
const { colors, modal, overlay, space, zIndex } = require('style');
const { Box } = require('components/display');
const Link = require('components/Link/Link');
const IconCross = require('components/Icon/IconCross');
const UI = require('utils/UI');

const Header = require('./ModalHeader');
const Title = require('./ModalTitle');
const Subheader = require('./ModalSubheader');
const Body = require('./ModalBody');
const Footer = require('./ModalFooter');

/**
 * Fixed positioned Modal for use with modal dialogs
 */

const Modal = function () { };

Modal.prototype.render = function () {
    const isMobile = Sephora.isMobile();
    const isDesktop = Sephora.isDesktop();

    const {
        open,
        onDismiss,
        children,
        sm,
        lg,
        width = modal.WIDTH.MD,
        isDrawer,
        scrollHeight,
        isFixedHeader,
        isFixedSubheader,
        showDismiss = true,
        ...props
    } = this.props;

    const styles = {
        fixed: {
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backfaceVisibility: 'hidden'
        },
        window: {
            flexDirection: 'column',
            zIndex: zIndex.MODAL,
            paddingTop: isDesktop ? space[7] : null,
            paddingBottom: isDesktop ? space[7] : null
        },
        windowScroll: (isDesktop || !isFixedHeader) ? {
            WebkitOverflowScrolling: 'touch',
            overflowX: 'hidden',
            overflowY: 'scroll'
        } : {},
        dialog: isDrawer ? {
            marginTop: 'auto'
        } : {
            width,
            margin: 'auto'
        },
        inner: {
            position: 'relative',
            color: colors.black,
            backgroundColor: colors.white,
            width: '100%',
            height: isMobile && !isDrawer ? '100%' : null,
            /*
                trigger GPU acceleration to fix webkit touch overflow scroll issues:
                1. invisible input text - ILLUPH-83447
                2. random disappearing elements - ILLUPH-83742
            */
            transform: (isDesktop || !isFixedHeader) ? 'translateZ(0)' : null
        },
        backdrop: {
            display: open ? 'block' : 'none',
            backgroundColor: overlay.COLOR,
            opacity: overlay.OPACITY,
            zIndex: zIndex.MODAL - 1
        }
    };

    if (isDrawer) {
        styles.window.transition = 'transform .3s';
        styles.window.transform = open ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)';
        styles.window.display = 'flex';
    } else {
        styles.window.display = open ? 'flex' : 'none';
        if (isMobile) {
            styles.window.backgroundColor = colors.white;
            styles.dialog.width = styles.dialog.height = styles.inner.height = '100%';
        }
    }

    let dismiss = onDismiss;

    //when modal is opened set body overflow to hidden and when modal is closed set to auto
    if (!Sephora.isRootRender) {
        document.body.style.overflowY = open ? 'hidden' : 'auto';

        /* only for iOS devices */
        if (UI.isIOS()) {
            /**
             * set fixed body positioning to provide correct focus state
             * for the form on mobile devices
             */
            if (open) {
                UI.lockBackgroundPosition();
            } else {
                UI.unlockBackgroundPosition();
            }

            /**
             * decorate dismiss() function to reset body position for iOS devices
             */
            dismiss = function (e) {
                e.preventDefault();
                UI.unlockBackgroundPosition();
                onDismiss();
            };
        }
    }

    return (
        <div>
            <div
                className={css(styles.fixed, styles.window, styles.windowScroll)}
                onClick={e => dismiss(e)}>
                <Box
                    {...props}
                    is='div'
                    onClick={e => e.stopPropagation()}
                    cursor='default'
                    baseStyle={styles.dialog}>
                    <div className={css(styles.inner)}>
                        {React.Children.map(children,
                            (child, index) => child && React.cloneElement(child, {
                                scrollHeight: scrollHeight,
                                isFixedHeader: isFixedHeader,
                                isFixedSubheader: isFixedSubheader,
                                showDismiss: showDismiss
                            })
                        )}
                        {(isDrawer || !showDismiss) ||
                            <Link
                                paddingX={isMobile ?
                                    modal.PADDING_MW : modal.PADDING_FS}
                                height={modal.HEADER_HEIGHT - 1}
                                lineHeight={0}
                                position='absolute'
                                top={0} right={0}
                                fontSize={modal.X_SIZE}
                                zIndex={3}
                                onClick={e => dismiss(e)}>
                                <IconCross x={true} />
                            </Link>
                        }
                    </div>
                </Box>
            </div>
            {(isDesktop || isDrawer) &&
                <div className={css(styles.fixed, styles.backdrop)} />
            }
        </div>
    );
};

Modal.prototype.propTypes = {
    /** Shows and hides Modal */
    open: React.PropTypes.bool,
    /** Click event callback for the Modal background */
    onDismiss: React.PropTypes.func,
    /** Small inner size; desktop only */
    sm: React.PropTypes.bool,
    /** Large inner size; desktop only */
    lg: React.PropTypes.bool,
    /** Width override; desktop only */
    width: React.PropTypes.number,
    /** Fixed position header; mobile only */
    isFixedHeader: React.PropTypes.bool,
    /** Fixed position subheader; mobile only */
    isFixedSubheader: React.PropTypes.bool,
    /** Modal transitions from and sits at bottom of viewport; mobile only */
    isDrawer: React.PropTypes.bool,
    /** Hide close `X` button */
    showDismiss: React.PropTypes.bool,
    /** Set max height on body to make it scrollable; desktop only */
    scrollHeight: React.PropTypes.number
};

Modal.prototype.getDefaultProps = function () {
    return {
        open: false,
        onDismiss: function () { }
    };
};

Modal.Header = Header;
Modal.Title = Title;
Modal.Subheader = Subheader;
Modal.Body = Body;
Modal.Footer = Footer;


// Added by sephora-jsx-loader.js
Modal.prototype.path = 'Modal';
// Added by sephora-jsx-loader.js
Modal.prototype.class = 'Modal';
// Added by sephora-jsx-loader.js
Modal.prototype.getInitialState = function() {
    Modal.apply(this, this.props.constructorArgs);
    return this.state;
};
// Added by sephora-jsx-loader.js
Modal.prototype.render = wrapComponentRender(Modal.prototype.render);
// Added by sephora-jsx-loader.js
var ModalClass = React.createClass(Modal.prototype);
// Added by sephora-jsx-loader.js
ModalClass.prototype.classRef = ModalClass;
// Added by sephora-jsx-loader.js
Object.assign(ModalClass, Modal);
// Added by sephora-jsx-loader.js
module.exports = ModalClass;


// WEBPACK FOOTER //
// ./public_ufe/js/components/Modal/Modal.jsx