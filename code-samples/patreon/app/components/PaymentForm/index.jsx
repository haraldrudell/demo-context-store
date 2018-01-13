import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles.less'
import Button from 'components/Button'
import Block from 'components/Layout/Block'
import Input from 'components/PaymentFormInput'
import SelectMenu from 'components/PaymentFormSelectMenu'
import Checkbox from 'components/PaymentFormCheckbox'
import Header from 'components/PaymentFormHeader'
import Navigation from 'components/PaymentFormNavigation'

function addElementToForm(item) {
    item.keyCode = item.key

    const props = { ...item }

    const options = {
        input: <Input {...props} />,
        select: <SelectMenu {...props} />,
        checkbox: <Checkbox {...props} />,
        header: <Header {...props} />,
    }

    return options[item.type]
}

export default class extends React.Component {
    static propTypes = {
        form: PropTypes.array,
        keyCode: PropTypes.string,
        saving: PropTypes.bool,
        dispatchChange: PropTypes.func,
        dispatchSubmit: PropTypes.func,
        dispatchCancel: PropTypes.func,
    }

    static defaultProps = (function() {
        form: null
    })()

    handleChange = e => {
        return this.props.dispatchChange({
            key: this.props.keyCode,
            value: e.target.value,
        })
    }

    handleSubmit = e => {
        let inputs = document.getElementsByTagName('input')
        let inputWasFocused = false

        for (let key in inputs) {
            if (inputs.hasOwnProperty(key)) {
                if (inputs[key] === document.activeElement) {
                    inputs[key].blur()
                    inputWasFocused = true
                }
            }
        }

        if (!inputWasFocused) {
            return this.props.dispatchSubmit({
                form: this.props.form,
            })
        }
    }

    handleMouseEnter = e => {
        let inputs = document.getElementsByTagName('input')

        for (let key in inputs) {
            if (inputs.hasOwnProperty(key)) {
                if (inputs[key] === document.activeElement) {
                    inputs[key].blur()
                }
            }
        }
    }

    handleCancel = e => {
        return this.props.dispatchCancel()
    }

    render() {
        const { form, dispatchChange, saving } = this.props
        const submitBtnText = saving ? 'Submitting...' : 'Submit this form'
        const elements = !form
            ? null
            : form.map(function(item) {
                  let htmlToAppend = Array.isArray(item) ? [] : null

                  if (Array.isArray(item)) {
                      if (item[0].case === 'custom') {
                          item.forEach(function(childItem) {
                              childItem.dispatchChange = dispatchChange

                              htmlToAppend.push(
                                  <div className="col-md-4 col-xs-12">
                                      {addElementToForm(childItem)}
                                  </div>,
                              )
                          })
                      } else {
                          item.forEach(function(childItem) {
                              childItem.dispatchChange = dispatchChange

                              htmlToAppend.push(
                                  <div className="col-md-6 col-xs-12">
                                      {addElementToForm(childItem)}
                                  </div>,
                              )
                          })
                      }
                  } else {
                      item.dispatchChange = dispatchChange

                      htmlToAppend =
                          item.type === 'header'
                              ? addElementToForm(item)
                              : <div className="col-xs-12">
                                    {addElementToForm(item)}
                                </div>
                  }

                  return htmlToAppend
              })

        return (
            <div className={styles.page}>
                <Navigation />
                <div className={styles.component}>
                    <form className="row">
                        {elements}
                        <div className="end-xs col-xs-12">
                            <Block pv={1} ph={2} mv={1} mr={0.5} ml={2}>
                                <Button
                                    color="gray"
                                    size="md"
                                    onClick={this.handleCancel}
                                >
                                    Cancel
                                </Button>
                            </Block>
                            <Block pv={1} ph={2} mv={1} mr={0.5} ml={2}>
                                <Button
                                    color="secondary"
                                    size="md"
                                    disabled={saving}
                                    onMouseEnter={this.handleMouseEnter}
                                    onClick={this.handleSubmit}
                                >
                                    {submitBtnText}
                                </Button>
                            </Block>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/PaymentForm/index.jsx