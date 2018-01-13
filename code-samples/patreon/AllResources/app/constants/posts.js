export const API_POST_TYPES = {
    IMAGE_FILE: 'image_file',
    IMAGE_EMBED: 'image_embed',
    AUDIO_FILE: 'audio_file',
    VIDEO_EMBED: 'video_embed',
    AUDIO_EMBED: 'audio_embed',
    TEXT_ONLY: 'text_only',
    LEGACY_IMAGE: 'image',
    LINK: 'link',
    POLL: 'poll',
    LIVESTREAM: 'livestream',
    LIVESTREAM_CROWDCAST: 'livestream_crowdcast',
    LIVESTREAM_YOUTUBE: 'livestream_youtube',
    DELETED: 'deleted',
}

export const POST_DISPLAY_TYPES = {
    IMAGE: 'IMAGE',
    AUDIO: 'AUDIO',
    AUDIO_WITH_IMAGE: 'AUDIO_WITH_IMAGE',
    VIDEO_EMBED: 'VIDEO_EMBED', // youtube, vimeo
    AUDIO_EMBED: 'AUDIO_EMBED', // soundcloud
    POLL: 'POLL',
    LIVESTREAM_CROWDCAST: 'LIVESTREAM_CROWDCAST',
    RICH_TEXT_ONLY: 'RICH_TEXT_ONLY',
    LINK: 'link',
    PROMOTION: 'PROMOTION',
    PRIVATE_CONTENT: 'PRIVATE_CONTENT',
}

// TODO: Change categories to constants. Just had something break because a
// category changed.
export const POST_TYPES_INFO = {
    TEXT: {
        title: 'Text',
        icon: 'typography',
        postType: API_POST_TYPES.TEXT_ONLY,
        category: 'TEXT',
    },
    PHOTO: {
        title: 'Image',
        icon: 'camera',
        postType: API_POST_TYPES.IMAGE_FILE,
        category: 'PHOTO',
    },
    VIDEO: {
        title: 'Video',
        icon: 'video',
        postType: API_POST_TYPES.VIDEO_EMBED,
        category: 'VIDEO',
    },
    AUDIO: {
        title: 'Audio',
        icon: 'headphones',
        postType: API_POST_TYPES.AUDIO_EMBED,
        category: 'AUDIO',
    },
    LINK: {
        title: 'Link',
        icon: 'link',
        postType: API_POST_TYPES.LINK,
        category: 'LINK',
    },
    POLL: {
        title: 'Polls',
        icon: 'sideBarGraph',
        postType: API_POST_TYPES.POLL,
        category: 'POLL',
    },
    LIVESTREAM: {
        title: 'Livestream',
        icon: 'livestream',
        postType: 'livestream',
        category: 'LIVESTREAM',
    },
    LIVESTREAM_CROWDCAST: {
        title: 'Livestream',
        icon: 'livestream',
        postType: API_POST_TYPES.LIVESTREAM_CROWDCAST,
        category: 'LIVESTREAM_CROWDCAST',
    },
    LIVESTREAM_YOUTUBE: {
        title: 'Livestream',
        icon: 'livestream',
        postType: API_POST_TYPES.LIVESTREAM_YOUTUBE,
        category: 'LIVESTREAM_YOUTUBE',
    },
    DELETED: {
        icon: 'close',
        postType: API_POST_TYPES.DELETED,
    },
}

export const MEDIA_NAME_FROM_CATEGORY = {
    AUDIO: 'audio',
    PHOTO: 'image',
    VIDEO: 'video',
    LINK: 'link',
    TEXT: 'text',
    LIVESTREAM_CROWDCAST: 'livestream',
    LIVESTREAM_YOUTUBE: 'livestream_youtube',
}

export const MEDIA_NAME_FOR_BLURRED_POSTS_FROM_CATEGORY = {
    [POST_DISPLAY_TYPES.IMAGE]: 'post',
    [POST_DISPLAY_TYPES.AUDIO]: 'post',
    [POST_DISPLAY_TYPES.AUDIO_WITH_IMAGE]: 'post',
    [POST_DISPLAY_TYPES.VIDEO_EMBED]: 'video',
    [POST_DISPLAY_TYPES.AUDIO_EMBED]: 'post',
    [POST_DISPLAY_TYPES.POLL]: 'poll',
    [POST_DISPLAY_TYPES.RICH_TEXT_ONLY]: 'post',
    [POST_DISPLAY_TYPES.LINK]: 'post',
    [POST_DISPLAY_TYPES.PROMOTION]: 'post',
    [POST_DISPLAY_TYPES.LIVESTREAM_CROWDCAST]: 'livestream',
    [POST_DISPLAY_TYPES.LIVESTREAM_YOUTUBE]: 'video',
    [POST_DISPLAY_TYPES.PRIVATE_CONTENT]: 'post',
}

export const POST_FIELDS = {
    TITLE: 'Title',
    TEXT: 'Text',
    IMAGE: 'Image',
    VIDEO: 'Video',
    AUDIO: 'Audio',
    LINK: 'Link',
    POLL_CHOICES: 'Poll Choices',
    EARLY_ACCESS: 'Early Access',
}

export const POST_TYPES_INFO_FROM_API = {
    [API_POST_TYPES.IMAGE_FILE]: POST_TYPES_INFO.PHOTO,
    [API_POST_TYPES.LEGACY_IMAGE]: POST_TYPES_INFO.PHOTO,
    [API_POST_TYPES.IMAGE_EMBED]: POST_TYPES_INFO.PHOTO,
    [API_POST_TYPES.AUDIO_FILE]: POST_TYPES_INFO.AUDIO,
    [API_POST_TYPES.AUDIO_EMBED]: POST_TYPES_INFO.AUDIO,
    [API_POST_TYPES.VIDEO_EMBED]: POST_TYPES_INFO.VIDEO,
    [API_POST_TYPES.TEXT_ONLY]: POST_TYPES_INFO.TEXT,
    [API_POST_TYPES.POLL]: POST_TYPES_INFO.POLL,
    [API_POST_TYPES.LINK]: POST_TYPES_INFO.LINK,
    [API_POST_TYPES.LIVESTREAM_CROWDCAST]: POST_TYPES_INFO.LIVESTREAM_CROWDCAST,
    [API_POST_TYPES.LIVESTREAM_YOUTUBE]: POST_TYPES_INFO.LIVESTREAM_YOUTUBE,
    [API_POST_TYPES.DELETED]: POST_TYPES_INFO.DELETED,
}

export const POST_FILTERS = {
    EXCLUSIVE: 1,
}

/* Use new max file size if you're using the new /media api.
   Check with back end if you need to increase - 512 is fairly arbitrary. -gb */
export const MAX_FILE_SIZE_NEW_MB = 512
export const MAX_FILE_SIZE_MB = 200
export const SUPPORTED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'gif']

export const SUPPORTED_IMAGE_TYPES_RE = /\.(jpg|jpeg|png|gif)$/

export const SUPPORTED_VIDEO_HOSTS_RE = /(youtube|youtu\.be|vimeo)/

export const SUPPORTED_AUDIO_HOSTS_RE = /soundcloud/



// WEBPACK FOOTER //
// ./app/constants/posts.js