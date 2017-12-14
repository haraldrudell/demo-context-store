const Authentication = require('utils/Authentication');
const getUser = require('utils/User').getUser;
const store = require('Store');
const watch = require('redux-watch');
const Actions = require('Actions');

function decorateWithCollectStateUpdatesFeature(decoratedComponentInstance) {
    let originalSetState = decoratedComponentInstance.setState;

    decoratedComponentInstance.collectState = function (state) {
        if (!this._collectedState) {
            this._collectedState = {};
        }

        this._collectedState = Object.assign({}, this._collectedState, state);
    };

    decoratedComponentInstance.setState = function (state) {
        let stateToSet = Object.assign({}, this._collectedState, state);
        originalSetState.call(this, stateToSet);
    };
}

// TODO 17.4: consolidate ensure recognized and force log in methods
// This function is a complete copy of ensureUserIsSignedIn decorator
// Only difference is that we are using the requireRecognizedAuthentication method
// instead of the requireLoggedInAuthentication method
function ensureUserIsAtLeastRecognized(DecoratedComponent) {

    let originalCtrlr = DecoratedComponent.prototype.ctrlr;
    let ctrlrAsync = DecoratedComponent.prototype.ctrlrAsync;

    let isUserAtleastRecognizedKey =
            `_${Math.round(Math.random() * 1000000)}_isUserAtleastRecognized`;

    DecoratedComponent.prototype.ctrlr = function () {

        decorateWithCollectStateUpdatesFeature(this);

        let rememberUserIsAtLeastRecognizedAndInvokeOriginalController = (user) => {
            let done;
            let finish = new Promise(resolve => {
                done = resolve;
            });

            this.collectState({ [isUserAtleastRecognizedKey]: true });

            if (ctrlrAsync) {
                ctrlrAsync.call(this, user, done);
            } else {
                originalCtrlr.call(this, user);
                done();
            }

            finish.then(() => {
                if (this.state[isUserAtleastRecognizedKey] === undefined) {
                    this.setState({});
                }
            });
        };

        Authentication.requireRecognizedAuthentication().then(() => {
            getUser().then(user => {
                rememberUserIsAtLeastRecognizedAndInvokeOriginalController.
                    call(this, user);
            });
        }).catch(() => {

            this.collectState({ [isUserAtleastRecognizedKey]: false });

            this.ctrlrForNotSignedIn();

            if (this.state[isUserAtleastRecognizedKey] === undefined) {
                this.setState({});
            }

            let userWatch = watch(store.getState, 'user');
            store.subscribe(userWatch(newUser => {
                if (newUser.profileId) {
                    rememberUserIsAtLeastRecognizedAndInvokeOriginalController.
                        call(this, newUser);
                }
            }));
        });
    };

    DecoratedComponent.prototype.isUserAtleastRecognized = function () {
        return this.state[isUserAtleastRecognizedKey] === true;
    };

    DecoratedComponent.prototype.isUserReady = function () {
        return typeof this.state[isUserAtleastRecognizedKey] === 'boolean';
    };

    DecoratedComponent.prototype.ctrlrForNotSignedIn = function () {};

    return DecoratedComponent;
}

function ensureUserIsSignedIn(DecoratedComponent) {

    let originalCtrlr = DecoratedComponent.prototype.ctrlr;
    let ctrlrAsync = DecoratedComponent.prototype.ctrlrAsync;

    // This is needed to prevent developers from even trying to rely on the
    // underlying state property.
    let isUserAuthenticatedKey =
            `_${Math.round(Math.random() * 1000000)}_isUserAuthenticated`;

    DecoratedComponent.prototype.ctrlr = function () {

        // This decoration here is needed for performance reasons.
        // If we used setState to set _isUserAuthenticated below, it would cause
        // a render. Then, `originalCtlr.call(this, user)` following it is going
        // to set the state by its design and cause another render. So, with the
        // setState approach, by using setState twie, we would end up having two
        // renders. This is exactly what we're trying to avoid.
        decorateWithCollectStateUpdatesFeature(this);

        let rememberUserIsAuthenticatedAndInvokeOriginalController = (user) => {
            let done;
            let finish = new Promise(resolve => {
                done = resolve;
            });

            this.collectState({ [isUserAuthenticatedKey]: true });

            if (ctrlrAsync) {
                ctrlrAsync.call(this, user, done);
            } else {
                originalCtrlr.call(this, user);
                done();
            }

            // For the ctrlrAsync to continue the `done` is passed to it.
            // That `done` is exactly what's finishes the decorator work. For
            // the regular synchronous `ctrlr` the `done` is called
            // automatically in the implicit manner above.
            finish.then(() => {
                // There was no setState in the original component, but we still
                // need the _isUserAuthenticated to end in the state, so we're
                // setting it here purposely.
                if (this.state[isUserAuthenticatedKey] === undefined) {
                    this.setState({});
                }
            });
        };

        Authentication.requireLoggedInAuthentication().then(() => {
            // TODO 17.4 mykhaylo.gavrylyuk: Figure out why the user is not
            // present right after the authentication and remove the 2nd level.
            getUser().then(user => {
                rememberUserIsAuthenticatedAndInvokeOriginalController.
                    call(this, user);
            });
        }).catch(() => {
            // NOTE mykhaylo.gavrylyuk: We may need to analize reasons for
            // failure at some future point to make components familiar with
            // them in order to render differently.
            // THIS IS THE VERY PLACE FOR DOING THAT!

            this.collectState({ [isUserAuthenticatedKey]: false });

            this.ctrlrForNotSignedIn();

            // For the same purpose described above.
            if (this.state[isUserAuthenticatedKey] === undefined) {
                this.setState({});
            }

            let userWatch = watch(store.getState, 'user');
            store.subscribe(userWatch(newUser => {
                if (newUser.profileId) {
                    rememberUserIsAuthenticatedAndInvokeOriginalController.
                        call(this, newUser);
                }
            }));
        });
    };

    // NOTE! This method should always be used in conjunction with
    // #isUserReady(), as because if the user is not ready, it will look like
    // she's not authenticated, which is not true, because she's just not yet
    // arrived.
    DecoratedComponent.prototype.isUserAuthenticated = function () {
        return this.state[isUserAuthenticatedKey] === true;
    };

    DecoratedComponent.prototype.isUserReady = function () {
        // It is safe to use this property here too as once the user is ready,
        // it's value will be either true, or false. And this way we don't need
        // to introduce another property on the state, which is good.
        return typeof this.state[isUserAuthenticatedKey] === 'boolean';
    };

    // If there's ever a need to set state on component for the case
    // when user is not authenticated, this is the right place.
    // Please overwrite this dummy method on your components.
    DecoratedComponent.prototype.ctrlrForNotSignedIn = function () {};

    return DecoratedComponent;
}

function requireSignedInUser(DecoratedComponent) {
    let originalCtrlr = DecoratedComponent.prototype.ctrlr;

    DecoratedComponent.prototype.ctrlr = function () {
        getUser().then(user => {
            originalCtrlr.call(this, user);
        });
    };

    return DecoratedComponent;
}


// The purpose of this decorator is to make showing/hiding the interstice
// as easy as wrapping the related api call.
//
// It is supposed to be leveraged with the use of `withInterstice` morphem
// in the code:
//
// > withInterstice(checkoutApi.getOrderDetails)(orderId)

function decorateApiCallWithInterstice(method) {
    return (...args) => {
        store.dispatch(Actions.showInterstice(true));

        return method(...args).
            then(data => {
                store.dispatch(Actions.showInterstice(false));
                return Promise.resolve(data);
            }).
            catch(reason => {
                store.dispatch(Actions.showInterstice(false));
                return Promise.reject(reason);
            });
    };
}

module.exports = {
    ensureUserIsAtLeastRecognized,
    ensureUserIsSignedIn,
    requireSignedInUser,
    decorateApiCallWithInterstice,
    withInterstice: decorateApiCallWithInterstice
};



// WEBPACK FOOTER //
// ./public_ufe/js/utils/decorators.js