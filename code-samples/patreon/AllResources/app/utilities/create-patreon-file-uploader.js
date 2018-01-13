import QQ from 'fine-uploader/lib/core'
import { SUPPORTED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '../constants/posts'
import jsonApiUrl from 'utilities/json-api-url'
import getCsrfHeadersWithPromise from 'utilities/csrf'

const noop = () => {}

const DEFAULT_FINE_UPLOADER_OPTIONS = {
    stopOnFirstInvalidFile: true,
    sizeLimit: MAX_FILE_SIZE_MB * 1024 * 1024,
    validation: { SUPPORTED_IMAGE_TYPES },
    request: {
        inputName: 'file',
    },
    cors: { expected: true, sendCredentials: true, allowXdr: true },
}

export default function({
    endpoint = '',
    targetElement,
    uploadImmediately = false, // if false, call uploader.uploadStoredFiles().
    // if true, might not need to retain reference to uploader.
    onCreateUploaderSuccess = noop,
    onCreateUploaderFailure = noop,
    onUploadSubmitted = noop,
    onUploadProgress = noop,
    onUploadComplete = noop,
    onUploadError = noop,
    callbacks = {},
    uploaderOptions = {},
}) {
    const options = {
        ...DEFAULT_FINE_UPLOADER_OPTIONS,
        ...uploaderOptions,
        callbacks: {
            onSubmitted: onUploadSubmitted,
            onProgress: onUploadProgress,
            onComplete: onUploadComplete,
            onError: onUploadError,
            ...callbacks,
        },
        autoUpload: uploadImmediately,
        button: targetElement,
    }

    const uploader = new QQ.FineUploaderBasic(options)
    uploader.setEndpoint(jsonApiUrl(endpoint))

    getCsrfHeadersWithPromise()
        .then(csrfHeaders => uploader.setCustomHeaders(csrfHeaders))
        .then(onCreateUploaderSuccess)
        .catch(onCreateUploaderFailure)

    return uploader
}



// WEBPACK FOOTER //
// ./app/utilities/create-patreon-file-uploader.js