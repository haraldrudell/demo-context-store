'use strict';

/**
 * Reset Image orientation - This function sets the correct EXIF data of image
 * @param {string} srcBase64 - Image in base 64 for processing
 * @param {blob} file - Actual image file
 * @param {function} callback - result of corrected image
 */
let resetOrientation = function (srcBase64, file, callback) {
    getImageOrientation(file, function (imgOrientation) {
        let img = new Image();
        img.onload = function() {
            let width = img.width,
                height = img.height,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');
            
            // set proper canvas dimensions before transform & export
            if ([5, 6, 7, 8].indexOf(imgOrientation) > -1) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }
            // transform context before drawing image
            switch (imgOrientation) {
                case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
                case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
                case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
                case 7: ctx.transform(0, -1, -1, 0, height, width); break;
                case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                default: ctx.transform(1, 0, 0, 1, 0, 0);
            }

            ctx.drawImage(img, 0, 0);
            callback(canvas.toDataURL());
        };
        // Read image to start process 
        img.src = srcBase64;
    });
};

/**
 * Get Image Orientation - This function gets the actual EXIF data from an image file
 * @param {blob} file - Actual image file
 * @param {function} callback - result with the value for EXIF of image
 */
let getImageOrientation = function (file, callback) {
    let reader = new FileReader();

    reader.onload = function(event) {
        let view = new DataView(event.target.result);
        if (view.getUint16(0, false) !== 0xFFD8) {
            // Not a JPEG
            return callback(-2);
        }
        let length = view.byteLength,
            offset = 2;

        while (offset < length) {
            let marker = view.getUint16(offset, false);
            offset += 2;

            if (marker === 0xFFE1) {
                if (view.getUint32(offset += 2, false) !== 0x45786966) {
                    return callback(-1);
                }
                
                let little = view.getUint16(offset += 6, false) === 0x4949;
                offset += view.getUint32(offset + 4, little);
                let tags = view.getUint16(offset, little);
                offset += 2;

                for (let i = 0; i < tags; i++) {
                    if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                        return callback(view.getUint16(offset + (i * 12) + 8, little));
                    }
                }
            } else if ((marker & 0xFF00) !== 0xFF00) {
                break;
            } else {
                offset += view.getUint16(offset, false);
            }
        }
        return callback(-1);
    };

    // Read the file as an Array buffer for processing 
    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
};

const ImageUtil = {
    resetOrientation: resetOrientation,
    getImageOrientation: getImageOrientation
};

module.exports = ImageUtil;



// WEBPACK FOOTER //
// ./public_ufe/js/utils/Image.js