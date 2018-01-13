import find from 'lodash/find'

const categories = [
    {
        id: 1,
        route: 'video',
        name: 'Video & Film',
        icon: 'videoAndFilm',
        creation: 'video',
        creators: 'video creators',
        fallbackBannerImage:
            'https://c5.patreon.com/external/landing_pages/images/heroes/video_hero.jpg',
        fans: 'viewers',
        headline: 'The Complexly team produces videos for 14M fans',
        href: '/c/video',
        featureVideoYouTubeId: 'dOCTt-O9TR8',
        bannerVideoSources: [
            {
                type: 'video/mp4',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/complexly_background.mp4',
            },
            {
                type: 'video/webm; codecs=vp8,vorbis',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/complexly_background_vp8.webm',
            },
        ],
        features: [
            {
                icon: 'alarmClockLg',
                title: 'Early Access',
                description:
                    'Allow patrons to see new videos before anyone else by offering exclusive early access.',
            },
            {
                icon: 'fivePercentLg',
                title: 'Lowest Fees In The Industry',
                description:
                    '5%. Yep, that’s it. And after processing fees, it’s all yours.',
            },
            {
                icon: 'backstagePassLg',
                title: 'Take Patrons Backstage',
                description:
                    'With patron-only posts, you can show patrons a behind-the-scenes look into your process.',
            },
            {
                icon: 'handshakeLg',
                title: 'Create On Your Terms',
                description:
                    'Still want to run ads, do brand deals, or work with sponsors? Cool with us!',
            },
        ],
        moreCreators: [5717885, 4667508, 162319, 43579, 3999679, 363113],
        testimonials: [
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/mk_wiles.jpg',
                youtubeVideoId: 'VjGn0QXSdeg',
                userId: 165186,
                quote:
                    'I’m able to get up in the morning, decide how I want to create that day, interact with my patrons that day, what I want to do for myself to further my own career, and what I want to do for the world. **I wouldn’t have that ability if I didn’t have the support coming from Patreon.**',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/jimmy_diresta.jpg',
                youtubeVideoId: 'zXbtrBa-CbU',
                userId: 2465732,
                quote:
                    'The most amazing thing about Patreon is […] that someone like me can have a rapport with my fans directly. **It changed my life in the way that I’m not waiting for somebody else to make my life happen.** I’m making my life happen.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/issa_rae.jpg',
                userId: 93881,
                quote:
                    'I first launched my Patreon page as a way to fund the content that we were putting out on a weekly basis. […] Now, **we use Patreon as a membership program** to not only fund content, but to hold local events and give supporters exclusive perks.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/dave_rubin.jpg',
                userId: 44770,
                quote:
                    '**Joining Patreon was the single best career move I’ve ever made.** We started a production company, got new equipment and built a home studio all in the last six months, and this is just the beginning. I’m truly beholden to nobody, well except my dog, and that’s really the greatest gift you can get as a content creator.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/kinda_funny.jpg',
                youtubeVideoId: 'MTgn8Udw1kM',
                userId: 291801,
                quote:
                    'We couldn’t do this without Patreon. […] Patreon takes away the level of guesswork that will actually allow you to **strategically plan and grow your business.**',
            },
        ],
    },
    {
        id: 2,
        route: 'music',
        name: 'Music',
        icon: 'music',
        creation: 'music',
        creators: 'musicians',
        fallbackBannerImage:
            'https://c5.patreon.com/external/landing_pages/images/heroes/music_hero.jpg',
        fans: 'listeners',
        headline: '​​Thousands of musicians are using Patreon',
        href: '/c/music',
        featureVideoYouTubeId: 'kJPM3S9qX9M',
        bannerVideoSources: [
            {
                type: 'video/mp4',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/music_mashup_background.mp4',
            },
            {
                type: 'video/webm; codecs=vp8,vorbis',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/music_mashup_background_vp8.webm',
            },
        ],
        features: [
            {
                icon: 'calendarLg',
                title: 'Your Music, Your Schedule',
                description:
                    'Posting tracks weekly? Waiting to release an album? No matter what, you call the shots.',
            },
            {
                icon: 'fivePercentLg',
                title: 'Lowest Fees In The Industry',
                description:
                    '5%. Yep, that’s it. And after processing fees, the rest is all yours.',
            },
            {
                icon: 'alarmClockLg',
                title: 'Early Access Made Easy',
                description:
                    'Allow patrons to hear new tracks before anyone else by offering exclusive early access.',
            },
            {
                icon: 'handshakeLg',
                title: 'Retain Full Control',
                description:
                    'Still want to run ads, do brand deals, or work with sponsors? Cool with us!',
            },
        ],
        moreCreators: [
            92107,
            151633,
            94868,
            116225,
            30561,
            45389,
            30835,
            34118,
            251077,
        ],
        testimonials: [
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/julia_nunes.jpg',
                userId: 31630,
                quote:
                    'You guys give me the ability to make record-label quality music and music videos **without signing away any of my creative rights.**',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/cyrille_aimee.jpg',
                userId: 406785,
                quote:
                    'To me, **Patreon is the future of the music business.** To cut out the middle man and make art accessible directly from the artist to the fan, is one of the beauties of internet.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/future_sunsets.jpg',
                userId: 324377,
                quote:
                    'I’ve built a relationship with fans that have been there every single time I release something. Our relationships with each other have grown already, because I’ve found that **my fans truly want to play for the long game and want me to have a successful music career.**',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/peter_hollens.jpg',
                userId: 31012,
                quote:
                    'Patreon not only changed my life, but changed the lives of the people I employ, the 19 contractors and the full-time employees. Because of them, **I’m able now to grow a digital media company** and help foster this type of creation.',
            },
        ],
    },
    {
        id: 3,
        route: 'writing',
        name: 'Writing',
        icon: 'writing',
        creation: 'writing',
        creators: 'writers',
        fallbackBannerImage:
            'https://c5.patreon.com/external/landing_pages/images/heroes/index_hero.jpg',
        fans: 'readers',
        headline: '​​Thousands of writers make a meaningful salary on Patreon',
        href: '/c/writing',
        featureVideoYouTubeId: 'rwvUjAv6pxg',
        bannerVideoSources: [
            {
                type: 'video/mp4',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/what_is_patreon_background.mp4',
            },
            {
                type: 'video/webm; codecs=vp8,vorbis',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/what_is_patreon_background_vp8.webm',
            },
        ],
        features: [
            {
                icon: 'alarmClockLg',
                title: 'Early Access',
                description:
                    'Allow patrons to get new releases before anyone else by offering exclusive early access.',
            },
            {
                icon: 'fivePercentLg',
                title: 'Lowest Fees In The Industry',
                description:
                    '5%. Yep, that’s it. And after processing fees, it’s all yours.',
            },
            {
                icon: 'calendarLg',
                title: 'Your Work, Your Schedule',
                description:
                    'Releasing by post or chapter? Waiting for the finished project? No matter what, you call the shots.',
            },
            {
                icon: 'handshakeLg',
                title: 'Retain Full Control',
                description:
                    'You own 100% of your content, and will sign exactly 0 contracts for Patreon.',
            },
        ],
        moreCreators: [2467017, 3103296, 3776761, 4813258, 5100035],
        testimonials: [
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/tim_urban.jpg',
                userId: 519556,
                quote:
                    'It’s **been a total game-changer**. Patreon now supports both me and our new, full-time manager of Lots Of Things. We’d be happy to keep doing things exactly how we’re doing them for a long time, and now we can.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/knitty.jpg',
                userId: 598365,
                quote:
                    'To go from being scared your company is in the toilet to feeling confident about the future in 36 hours is still surreal. **I’m trying to process what all this means.**',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/stant_litore.jpg',
                userId: 153826,
                quote:
                    'Patreon means **more freedom and it means more time to do what you truly love** – and, in fact, what your fans most want you to spend time doing!',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/jimquisition.jpg',
                userId: 381862,
                quote:
                    'Patreon, at least from my experience, means **a place where artists and creators can be themselves.** It’s a new way out for those who don’t do things the way they’re ‘supposed’ to be done.',
            },
        ],
    },
    {
        id: 4,
        route: 'illustrators',
        name: 'Comics & Illustration',
        icon: 'comics',
        creation: 'art',
        creators: 'visual artists',
        fallbackBannerImage:
            'https://c5.patreon.com/external/landing_pages/images/heroes/illustrators_hero.jpg',
        fans: 'fans',
        headline:
            'Ty Carter and 10,000+ visual artists create on their own terms',
        href: '/c/illustrators',
        featureVideoYouTubeId: 'DBEJHdAqCSg',
        bannerVideoSources: [
            {
                type: 'video/mp4',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/ty_carter_background.mp4',
            },
            {
                type: 'video/webm; codecs=vp8,vorbis',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/ty_carter_background_vp8.webm',
            },
        ],
        features: [
            {
                icon: 'alarmClockLg',
                title: 'Early Access',
                description:
                    'Allow patrons to see new releases before anyone else by offering exclusive early access.',
            },
            {
                icon: 'fivePercentLg',
                title: 'Lowest Fees In The Industry',
                description:
                    '5%. Yep, that’s it. And after processing fees, it’s all yours. ',
            },
            {
                icon: 'backstagePassLg',
                title: 'Invite Patrons Into Your Studio',
                description:
                    'With patron-only posts, you can show patrons a behind-the-scenes look at your process.',
            },
            {
                icon: 'handshakeLg',
                title: 'Retain Full Control',
                description:
                    'Still want to run ads, do brand deals, or work with sponsors? Cool with us!',
            },
        ],
        moreCreators: [5334461, 187390, 107818, 63499, 2563698],
        testimonials: [
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/fran_meneses.jpg',
                userId: 2669759,
                quote:
                    'I joined Patreon a year ago, and it’s been **the best decision I’ve made in the last couple of years.** Patreon has shifted my creative process: I can take the time to work on personal projects and create new material without having to worry about anything else. This is the first time in my life I have the space to do this, and I’m incredibly grateful.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/zach_weinersmith.png',
                userId: 42913,
                quote:
                    'It’s **the most reliable and relaxing way to make a living** for creators. Every other way to make money (ads, crowdfunding, merchandise, conventions…) is subject to seasonality and random fluctuations.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/ty_carter.jpg',
                userId: 79396,
                quote:
                    'The interesting thing about being able to connect like this online is that **the artist is no longer working by themselves.** I can share my process, my technique, my thoughts.',
            },
        ],
    },
    {
        id: 7,
        route: 'podcasts',
        name: 'Podcasts',
        icon: 'podcasts',
        creation: 'podcast',
        creators: 'podcasters',
        fallbackBannerImage:
            'https://c5.patreon.com/external/landing_pages/images/heroes/podcasts_hero.jpg',
        fans: 'listeners',
        headline:
            '​​Tom Merritt and 2,000+ podcasters run their business with Patreon',
        href: '/c/podcasts',
        featureVideoYouTubeId: '3ckvNQcRXqg',
        bannerVideoSources: [
            {
                type: 'video/mp4',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/tom_merritt_background.mp4',
            },
            {
                type: 'video/webm; codecs=vp8,vorbis',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/tom_merritt_background_vp8.webm',
            },
        ],
        features: [
            {
                icon: 'headphonesLg',
                title: 'Mobile Podcast Consumption',
                description: 'Easy listening with our mobile experience.',
            },
            {
                icon: 'rssLg',
                title: 'Private RSS feeds',
                description:
                    'Give patrons a private RSS link to use in their player of choice.',
            },
            {
                icon: 'alarmClockLg',
                title: 'Early Access Made Easy',
                description:
                    'Allow patrons to hear new episodes before anyone else by offering exclusive early access.',
            },
            {
                icon: 'handshakeLg',
                title: 'Retain Full Control',
                description:
                    'Want to run ads, do brand deals, or work with sponsors? Cool with us!',
            },
        ],
        moreCreators: [
            5708833,
            1018642,
            289896,
            707473,
            800947,
            2487156,
            3343736,
            4696495,
            5114222,
            5696458,
            4475141,
        ],
        testimonials: [
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/wolf_359.jpg',
                youtubeVideoId: 'uACQfNawOBY',
                userId: 700719,
                quote:
                    'With the money we’re making on Patreon, we’re no longer losing money, we’re actually paying ourselves back. I very much see the platform as […] the start of a revolution of how art gets made and how creators can keep creating.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/kinda_funny.jpg',
                youtubeVideoId: 'MTgn8Udw1kM',
                userId: 291801,
                quote:
                    'We couldn’t do this without Patreon. […] **Patreon takes away the level of guesswork** that will actually allow you to strategically plan and grow your business.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/bowery_boys.jpg',
                youtubeVideoId: '6onGD2PV_8Q',
                userId: 624127,
                quote:
                    'We joined Patreon about 2 years ago, because we were looking for a way to be able to go **from a new show every month to a new show every two weeks.**',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/canadaland.jpg',
                userId: 298529,
                quote:
                    'Direct support from our listeners **keeps us accountable and lets us focus on our content and coverage.** Thanks to Patreon for existing.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/aubrey_sitterson.jpg',
                userId: 94166,
                quote:
                    '**Patreon means freedom.** […] It’s a way to produce art and content in the way it should be done: With creators connecting directly with their supporters, and no middle men.',
            },
        ],
    },
    {
        id: 8,
        route: 'games',
        name: 'Games',
        icon: 'games',
        creation: 'gaming content',
        creators: 'gaming creators',
        fallbackBannerImage:
            'https://c5.patreon.com/external/landing_pages/images/heroes/games_hero.jpg',
        fans: 'audience',
        headline: 'Kinda Funny runs their business on Patreon',
        href: '/c/games',
        featureVideoYouTubeId: 'MTgn8Udw1kM',
        bannerVideoSources: [
            {
                type: 'video/mp4',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/kinda_funny_background.mp4',
            },
            {
                type: 'video/webm; codecs=vp8,vorbis',
                url:
                    'https://c5.patreon.com/external/landing_pages/video/kinda_funny_background_vp8.webm',
            },
        ],
        features: [
            {
                icon: 'discordLg',
                title: 'Offer Special Discord Perks',
                description:
                    'Give special roles & access to chatrooms through our Discord partnership.',
            },
            {
                icon: 'fivePercentLg',
                title: 'Lowest Fees In The Industry',
                description:
                    '5%. Yep, that’s it. And after processing fees, it’s all yours.',
            },
            {
                icon: 'alarmClockLg',
                title: 'Early Access',
                description:
                    'Allow patrons to hear new episodes before anyone else by offering exclusive early access.',
            },
            {
                icon: 'handshakeLg',
                title: 'Retain Full Control',
                description:
                    'Want to run ads, do brand deals, or work with sponsors? Cool with us!',
            },
        ],
        moreCreators: [455720, 563826, 1013964, 2429487, 3564261, 3795200],
        testimonials: [
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/danny_odwyer.jpg',
                userId: 201534,
                quote:
                    'I expected Patreon to be a parachute, but in my experience its been a rocket strapped to my back. It’s as much **a platform to communicate art, as it is a platform to manage funds.**',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/whats_good_games.jpg',
                userId: 6119526,
                quote:
                    'More funding means **more time to dedicate to new streams, interviews, events and more,** on top of the weekly podcast.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/bay_12_games.jpg',
                userId: 730152,
                quote:
                    'Patreon has been providing **one half to two thirds of our income** every month this year, and that allows us to keep making video games without having to worry much about specific methods.',
            },
            {
                imageSource:
                    'https://c5.patreon.com/external/landing_pages/images/easy_allies.jpg',
                userId: 3026041,
                quote:
                    'Patreon has not only **given us the financial stability** to continue doing what we love, but also provided us with ways to **get closer to our audience** than ever before.',
            },
        ],
    },
    {
        id: 5,
        creators: 'artists',
        name: 'Drawing & Painting',
        href: '/c/illustrators',
        icon: 'drawingAndPainting',
    },
    {
        id: 6,
        creators: 'animators',
        name: 'Animation',
        href: '/explore/animation',
        icon: 'animation',
    },
    {
        id: 9,
        creators: 'photographers',
        name: 'Photography',
        href: '/explore/photography',
        icon: 'photography',
    },
    {
        id: 11,
        creators: 'science creators',
        name: 'Science',
        href: '/explore/science',
        icon: 'science',
    },
    {
        id: 12,
        creators: 'education creators',
        name: 'Education',
        href: '/explore/education',
        icon: 'education',
    },
    {
        id: 13,
        creators: 'crafters',
        name: 'Crafts & DIY',
        href: '/explore/diy',
        icon: 'craftsAndDIY',
    },
    {
        id: 14,
        creators: 'dancers and actors',
        name: 'Dance & Theater',
        href: '/explore/theater',
        icon: 'danceAndTheater',
    },
    {
        id: 99,
        creators: 'all creators',
        name: 'Everything Else',
        href: '/explore',
        icon: 'everythingElse',
    },
]

// Export a map of all categories by route
export const categoriesByRoute = categories.reduce((map, category) => {
    if (category.route) {
        map[category.route] = category
    }
    return map
}, {})

export const categoriesWithRoute = categories.reduce((arr, category) => {
    if (category.route) {
        arr.push(category)
    }
    return arr
}, [])

export const getCategoryByRoute = route => {
    return find(categories, category => {
        return category.route === route
    })
}

// Export a map of all categories by id
export const categoriesById = categories.reduce((map, category) => {
    map[category.id] = category
    return map
}, {})

export const getRouteFromId = id => categoriesById[id].route

export default categories



// WEBPACK FOOTER //
// ./app/constants/categories.js