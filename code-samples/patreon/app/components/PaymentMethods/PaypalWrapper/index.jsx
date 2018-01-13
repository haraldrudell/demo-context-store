import PropTypes from 'prop-types'
import { Component } from 'react'
import get from 'lodash/get'
import nion from 'nion'
import { buildUrl } from 'utilities/json-api'
import {
    initBraintree,
    getBraintreeIsSetup,
    addBraintreePayment as addBraintreePaymentUtil,
} from 'utilities/payments/braintree'
import getDataOrNot from 'utilities/get-data-or-not'

export const addBraintreePayment = addBraintreePaymentUtil

@nion({
    braintree: {
        endpoint: buildUrl('/cards/braintree-client-token'),
    },
    cards: {
        endpoint: buildUrl('/cards', {
            include: ['user', 'pledges.card', 'pledges.campaign.creator'],
            fields: {
                user: ['thumb_url', 'full_name'],
                pledge: [],
                campaign: [],
                card: [
                    'number',
                    'expiration_date',
                    'card_type',
                    'has_a_failed_payment',
                    'created_at',
                ],
            },
            'json-api-use-default-includes': false,
        }),
    },
})
export default class PaypalWrapper extends Component {
    static propTypes = {
        children: PropTypes.func.isRequired,
    }

    componentWillMount = () => {
        let { braintree } = this.props.nion
        if (!getBraintreeIsSetup()) {
            braintree.actions.get().then(() => {
                initBraintree(
                    getDataOrNot(this.props.nion.braintree)
                        .braintreeClientToken,
                    'en_us',
                    this.handleAddBraintreeCard,
                )
            })
        }
    }

    handleAddBraintreeCard = (token, deviceData) => {
        return this.props.nion.cards.actions.post(
            {
                data: {
                    paypal_token: token,
                    braintree_device_data: deviceData,
                },
            },
            {},
            { append: true },
        )
    }

    render = () => {
        const isLoadingBraintreeToken = get(
            this.props.nion,
            'braintree.request.isLoading',
        )
        const isLoadingAddCardRequest = get(
            this.props.nion,
            'cards.request.isLoading',
        )
        return this.props.children({
            addPaypal: addBraintreePaymentUtil,
            isLoading: isLoadingBraintreeToken || isLoadingAddCardRequest,
        })
    }
}



// WEBPACK FOOTER //
// ./app/components/PaymentMethods/PaypalWrapper/index.jsx