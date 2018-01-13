import { BASE_CDN_URL } from 'constants/cdn'

export const getBlurredTextImage = (isPostPage, title) => {
    // there's 4 text style varions of the image: 1, 2, 3, and 4.
    const sophisticatedRng = title ? title.length % 4 + 1 : 1
    const src = size => {
        return `${BASE_CDN_URL}/internal/posts/blurred-text/${size}${sophisticatedRng}.jpg`
    }

    // there's 3 size variations of the image: sm, md, lg
    // Height is needed so it loads nicely. For width, we just use 100%.
    const mdImg = { src: src('md'), height: '160px' }
    const lgImg = { src: src('lg'), height: '315px' }

    // return the correct size image depending on browser width
    return isPostPage ? lgImg : mdImg
}



// WEBPACK FOOTER //
// ./app/features/posts/LockedPostBanner/utilities.js