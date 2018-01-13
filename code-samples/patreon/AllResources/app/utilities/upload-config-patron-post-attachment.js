import { SUPPORTED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '../constants/posts'

const allowedExtensions = SUPPORTED_IMAGE_TYPES.map(ext => ext.replace(/^\./, ''))

export default function () {
    return {
        sizeLimit: MAX_FILE_SIZE_MB * 1024 * 1024,
        validation: { allowedExtensions },
        request: {
            inputName: 'file'
        },
        cors: { expected: true, sendCredentials: true, allowXdr: true }
    }
}



// WEBPACK FOOTER //
// ./app/utilities/upload-config-patron-post-attachment.js