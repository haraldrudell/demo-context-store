import React from 'react'
import { Toaster, Intent } from '@blueprintjs/core'
import { BlockingSpinner } from '../Spinner/Spinner'
import Confirm from '../Confirm/Confirm'
import Utils from '../../components/Utils/Utils'
import css from './PageContainer.css'

const toaster = Toaster.create(/* { autoFocus: true }*/)

function createPageContainer () {
  return ChildComponent =>
    class extends React.Component {
      state = {
        isPageInitialized: false, // (is the first fetch done?)
        isPageLoading: false,
        confirmShow: false // for <Confirm>
      }

      childRef = {}

      spinner = {
        show: options => {
          if (!this.state.isPageLoading) {
            this.setState({ isPageLoading: true })
          }
          if (options && options.timeout) {
            // if timeout set, hide the spinner.
            setTimeout(() => this.setState({ isPageLoading: false }), options.timeout)
          }
        },
        hide: () => {
          if (this.state.isPageLoading) {
            this.setState({ isPageLoading: false })
          }
        }
      }

      toaster = toaster

      confirm = {
        show: (title, text, onConfirmFn) => {
          // general Confirm (abort, stop, cancel, etc.)
          this.onConfirmFn = onConfirmFn
          this.setState({ confirmShow: true, confirmTitle: title, confirmText: text })
        },
        showConfirmDelete: onConfirmFn => {
          // confirm for deleting
          this.onConfirmFn = onConfirmFn
          this.setState({
            confirmShow: true,
            confirmTitle: 'Confirm Delete',
            confirmText: 'Are you sure you want to delete this?'
          })
        }
      }

      setup () {
        // add helper functions to this.toaster
        this.toaster.showError = params => this.toaster.show({ intent: Intent.DANGER, timeout: 0, ...params })
        this.toaster.showSuccess = params => this.toaster.show({ intent: Intent.SUCCESS, timeout: 0, ...params })
        this.toaster.showWarning = params => this.toaster.show({ intent: Intent.WARNING, ...params })
      }

      componentWillMount () {
        this.setup()
        // this.childRef is NOT available here yet.
      }

      async componentDidMount () {
        if (this.props.onPageWillMount) {
          // from App.js.
          const pageName = this.childRef.pageName || this.childRef.title
          this.props.onPageWillMount(this.childRef.title, 'Page: ' + pageName)
          const accounts = Utils.getJsonValue(this.props.dataStore, 'userData.accounts') || []
          const activeAccountId = this.props.urlParams.accountId
          const activeAccount = accounts.find(acc => acc.uuid === activeAccountId)
          document.title = `Harness | ${pageName}${activeAccount ? ' - ' + activeAccount.accountName : ''}`
        }
        if (this.childRef.autoFetch !== false) {
          // by default, do autoFetch (fetchData)
          await this.refreshData()
        }
        this.setState({ isPageInitialized: true })

        window.scrollTo(0, 0)
      }

      componentWillUnmount () {
        this.toaster.clear()
      }

      renderHeader () {
        return (
          this.childRef &&
          this.childRef.header &&
          <page-header>
            {
              this.childRef.header // header is optional
            }
          </page-header>
        )
      }

      refreshData = async () => {
        this.setState({ isPageLoading: true })
        if (this.childRef.fetchData) {
          await this.childRef.fetchData({})
        }
        this.setState({ isPageLoading: false })
      }

      onConfirmClick = async () => {
        this.setState({ confirmShow: false })
        await this.onConfirmFn()
      }

      render () {
        return (
          <page-container class={css.main}>
            {this.state.isPageLoading && <BlockingSpinner className={css.pageSpinner} />}

            {this.renderHeader()}

            <ChildComponent
              {...this.props}
              {...this.state}
              refreshData={this.refreshData}
              spinner={this.spinner}
              toaster={this.toaster}
              confirm={this.confirm}
              ref={ref => (this.childRef = ref)}
            />

            <Confirm
              visible={this.state.confirmShow}
              onConfirm={this.onConfirmClick}
              onClose={() => this.setState({ confirmShow: false })}
              body={this.state.confirmText}
              confirmText="Confirm"
              title={this.state.confirmTitle}
            >
              <button style={{ display: 'none' }} />
            </Confirm>
          </page-container>
        )
      }
    }
}

export default createPageContainer



// WEBPACK FOOTER //
// ../src/components/PageContainer/PageContainer.js