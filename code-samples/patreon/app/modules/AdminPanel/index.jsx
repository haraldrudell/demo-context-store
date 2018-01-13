import PropTypes from 'prop-types'
import React, { Component } from 'react'
import get from 'lodash/get'
import Dock from 'react-dock'
import localStorage from 'local-storage'
import { withState } from 'recompose'

import Block from 'components/Layout/Block'
import Button from 'components/Button'
import Flexy from 'components/Layout/Flexy'
import Section from './components/Section'

import colors from 'styles/themes/america/colors.js'

const ADMIN_TOGGLE_KEY = 'admin-toggles'
const ADMIN_PANEL_EXPANDED_SECTION = 'admin-panel-expanded-form'
import getWindow from 'utilities/get-window'

const SHOW_ADMIN_PANEL = 'show-admin-panel'
const BODY = get(document, 'querySelector')
    ? document.querySelector('body')
    : undefined

/* Maintain global state of admin panel visibility */
let isInitiallyOpen = localStorage(SHOW_ADMIN_PANEL) || false

const toggleBodyWidth = adminPanelIsVisible => {
    if (!BODY) {
        return
    }
    BODY.style.transition = 'margin-right .25s'
    BODY.style.marginRight = adminPanelIsVisible ? '285px' : '0px'
}

@withState('isOpen', 'setIsOpen', isInitiallyOpen)
export default class AdminPanel extends Component {
    static propTypes = {
        isOpen: PropTypes.bool,
        setIsOpen: PropTypes.func,
    }

    state = {
        sections: [],
        expandedSection: '',
        toggles: {},
    }

    componentWillMount() {
        const windowOrFixture = getWindow()
        // Setup the global window function to control the state of the admin panel
        windowOrFixture.toggleAdminPanel = forceOpen => {
            let showAdminPanel =
                typeof forceOpen === 'undefined'
                    ? !this.props.isOpen
                    : forceOpen
            localStorage(SHOW_ADMIN_PANEL, showAdminPanel)
            toggleBodyWidth(showAdminPanel)
            this.props.setIsOpen(showAdminPanel)
        }

        const sections = get(
            windowOrFixture,
            '_patreon.adminBootstrap._adminData.sections',
            [],
        )
        const expandedSection =
            localStorage(ADMIN_PANEL_EXPANDED_SECTION) || 'Impersonate'
        const toggles = localStorage(ADMIN_TOGGLE_KEY) || {}
        this.setState({
            sections,
            toggles,
            expandedSection,
        })
    }

    _setToggleState = (key, value) => {
        let toggles = { ...this.state.toggles }
        toggles[key] = value
        localStorage(ADMIN_TOGGLE_KEY, toggles)
        this.setState({ toggles })
    }

    handleClose = () => {
        const windowOrFixture = getWindow()
        if (windowOrFixture.toggleAdminPanel) {
            windowOrFixture.toggleAdminPanel(false)
        }
    }

    handleFormLabelClick = sectionLabel => {
        // allow closing forms
        if (sectionLabel === this.state.expandedSection) sectionLabel = ''
        localStorage(ADMIN_PANEL_EXPANDED_SECTION, sectionLabel)

        this.setState({
            expandedSection: sectionLabel,
        })
    }

    render() {
        return (
            <Dock
                position="right"
                fluid={false}
                size={300}
                isVisible={this.props.isOpen}
                dimMode="none"
                zIndex={2000}
                dockStyle={{ backgroundColor: colors.dark, boxShadow: 'none' }}
            >
                <Block p={2}>
                    <Flexy justifyContent="flex-end">
                        <Button size="sm" onClick={this.handleClose}>
                            Close
                        </Button>
                    </Flexy>

                    {this.state.sections.map((s, i) => {
                        return (
                            <Section
                                {...s}
                                key={i} // eslint-disable-line
                                onFormLabelClick={this.handleFormLabelClick}
                                onToggleChange={(key, value) => {
                                    this._setToggleState(key, value)
                                }}
                                toggles={this.state.toggles}
                                expandedSection={this.state.expandedSection}
                            />
                        )
                    })}
                </Block>
            </Dock>
        )
    }
}



// WEBPACK FOOTER //
// ./app/modules/AdminPanel/index.jsx