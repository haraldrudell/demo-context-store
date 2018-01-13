/* eslint-disable react/no-unused-prop-types */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ALL_EXTENSIONS from './constants'
import bindUploader from 'utilities/upload-file'
import configPatronPostAttachmentUpload from 'utilities/upload-config-patron-post-attachment'

import Button from 'components/Button'

class FileInputButton extends Component {
    static displayName = 'FileInputButton'

    static propTypes = {
        children: PropTypes.node,
        accept: PropTypes.arrayOf(ALL_EXTENSIONS),
        color: PropTypes.string,
        name: PropTypes.string,
        uploaderConfig: PropTypes.shape({
            sizeLimit: PropTypes.number,
            validation: PropTypes.shape({
                allowedExtensions: PropTypes.array,
            }),
            request: PropTypes.shape({
                inputName: PropTypes.string,
            }),
            cors: PropTypes.shape({
                expected: PropTypes.bool,
                sendCredentials: PropTypes.bool,
                allowXdr: PropTypes.bool,
            }),
        }),

        size: PropTypes.string,
        fluid: PropTypes.bool,
        disabled: PropTypes.bool,

        onProgress: PropTypes.func,
        onComplete: PropTypes.func,
        onSubmitted: PropTypes.func,
        onSubmit: PropTypes.func,
        onChange: PropTypes.func,
        onError: PropTypes.func,
        onCancel: PropTypes.func,
        onUploader: PropTypes.func,
    }

    static defaultProps = {
        options: [],
        disabled: false,
        color: 'gray',
        size: 'md',
        uploaderConfig: {},
        onUploader: function() {},
        onProgress: function() {},
        onError: function() {},
    }

    state = {
        nativeTargetClass: 'nativeTarget',
        uploader: null,
    }

    handleError = (id, name, err) => {
        this.props.onError(err)
    }

    handleSubmitted = (fileId, filename) => {
        const file = this.getUploader().getFile(fileId)
        this.props.onSubmitted(file)
    }

    handleProgress = (fileId, filename, currentBytes, totalBytes) => {
        this.props.onProgress(currentBytes / totalBytes)
    }

    handleComplete = (id, name, responseJSON, xhrReq) => {
        this.props.onComplete(responseJSON)
    }

    componentDidMount() {
        if (this.props.disabled) return

        const buttonForQQ = this.button
            ? ReactDOM.findDOMNode(this.button)
            : undefined
        const uploader = bindUploader({
            ...configPatronPostAttachmentUpload(),
            ...this.props.uploaderConfig,
            callbacks: {
                onSubmitted: this.handleSubmitted,
                onProgress: this.handleProgress,
                onComplete: this.handleComplete,
                onError: this.handleError,
            },
            button: buttonForQQ,
            stopOnFirstInvalidFile: true,
            autoUpload: false,
        })
        this._setUploader(uploader)
        this.props.onUploader(uploader)
    }

    _setUploader = uploader => {
        this.setState({ uploader })
    }

    getUploader = () => {
        return this.state.uploader
    }

    render() {
        return (
            <Button
                ref={el => (this.button = el)}
                disabled={this.props.disabled}
                fluid={this.props.fluid}
                color={this.props.color}
                size={this.props.size}
                div
            >
                {this.props.children}
            </Button>
        )
    }
}

export default FileInputButton



// WEBPACK FOOTER //
// ./app/components/FileInputButton/index.jsx