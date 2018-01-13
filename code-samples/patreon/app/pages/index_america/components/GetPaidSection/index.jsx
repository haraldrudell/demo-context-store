import t from 'prop-types'
import React, { Component } from 'react'

import Button from 'components/Button'
import ParticleSection from 'features/marketing/ParticleSection'

class GetPaidSection extends Component {
    static propTypes = {
        onClick: t.func,
    }

    constructor(props) {
        super(props)
    }

    render() {
        const { onClick } = this.props
        return (
            <ParticleSection title="Let's get you paid">
                <Button
                    color="primary"
                    href="/create?continue=true"
                    onClick={onClick}
                >
                    Start your page
                </Button>
            </ParticleSection>
        )
    }
}

export default GetPaidSection



// WEBPACK FOOTER //
// ./app/pages/index_america/components/GetPaidSection/index.jsx