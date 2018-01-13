import PropTypes from 'prop-types'
import { Component } from 'react'
import nion from 'nion'
import { buildUrl } from 'utilities/json-api'
import get from 'lodash/get'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { initStripeCheckout } from 'utilities/payments/stripe'
import { selectPreset } from 'libs/with-preset'
import { addCreditCard as addCreditCardUtil } from 'utilities/payments/stripe'

export const addCreditCard = addCreditCardUtil

const mapStateToProps = createStructuredSelector({
    stripeKey: selectPreset('stripeKey'),
})

@nion({
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
@connect(mapStateToProps)
export default class StripeWrapper extends Component {
    static propTypes = {
        stripeKey: PropTypes.string.isRequired,
        children: PropTypes.func.isRequired,
    }

    componentWillMount = () => {
        initStripeCheckout(this.props.stripeKey, this.handleAddStripeCreditCard)
    }

    handleAddStripeCreditCard = token => {
        return this.props.nion.cards.actions.post(
            {
                data: {
                    stripe_token: token.id,
                },
            },
            {},
            { append: true },
        )
    }

    render = () => {
        const isLoadingAddCardRequest = get(
            this.props.nion,
            'cards.request.isLoading',
        )
        return this.props.children({
            addCreditCard: addCreditCardUtil,
            isLoading: isLoadingAddCardRequest,
        })
    }
}



// WEBPACK FOOTER //
// ./app/components/PaymentMethods/StripeWrapper/index.jsx