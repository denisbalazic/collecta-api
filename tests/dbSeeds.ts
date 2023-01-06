import { CollectionType, CollectionVisibility, ICollection, ItemPropertyType } from '../domain/collection';

export const user = {
    user: {
        _id: '620df4ef18b174c4ba6bb983',
        name: 'TEST',
        email: 'testuser@test.com',
        password: '$2b$08$JvCi3hvvt3qgiFjZK3II8.YcB4UyoTBW/3KfliqyASO186UJCGNQm',
        tokens: [],
    },
    credentials: {
        email: 'testuser@test.com',
        password: 'Password1!',
        tokens: [],
    },
};

export const authedUser = {
    user: {
        _id: '620df4ef18b174c4ba6bb983',
        name: 'TEST',
        email: 'testuser@test.com',
        password: '$2b$08$JvCi3hvvt3qgiFjZK3II8.YcB4UyoTBW/3KfliqyASO186UJCGNQm',
        tokens: [
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGRmNGVmMThiMTc0YzRiYTZiYjk4MyIsIm5hbWUiOiJURVNUIiwiaWF0IjoxNjQ1Mjc0MTY5fQ.loGsIo9KRn41JD_JqJDbdQu0XvMnHgxaAVQ4xnekFas',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGRmNGVmMThiMTc0YzRiYTZiYjk4MyIsIm5hbWUiOiJURVNUIiwiaWF0IjoxNjQ1Mjc0MjAwfQ.2FgkERc2K-t4u7ks77jpTfgiwesZwtfyCjq_-kr7wgE',
        ],
    },
    credentials: {
        email: 'testuser@test.com',
        password: 'Password1!',
        tokens: [
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGRmNGVmMThiMTc0YzRiYTZiYjk4MyIsIm5hbWUiOiJURVNUIiwiaWF0IjoxNjQ1Mjc0MTY5fQ.loGsIo9KRn41JD_JqJDbdQu0XvMnHgxaAVQ4xnekFas',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMGRmNGVmMThiMTc0YzRiYTZiYjk4MyIsIm5hbWUiOiJURVNUIiwiaWF0IjoxNjQ1Mjc0MjAwfQ.2FgkERc2K-t4u7ks77jpTfgiwesZwtfyCjq_-kr7wgE',
        ],
    },
};

export const collectionsSeed: ICollection[] = [
    {
        _id: '6207a4ad48e6c1fceb13199c',
        name: 'Hulk',
        description:
            'Hulk is a comic book superhero created by Stan Lee and Jack Kirby. He first appeared in the debut issue of The Incredible Hulk (May 1962).',
        image: 'https://upload.wikimedia.org/wikipedia/en/5/59/Hulk_%28comics_character%29.png',
        type: CollectionType.STICKER,
        visibility: CollectionVisibility.PRIVATE,
        admins: ['5407a4ad48e761fceb131591'],
        openItemUpdating: false,
        itemProperties: [
            {
                label: 'Name',
                type: ItemPropertyType.TEXT,
            },
        ],
    },
    {
        _id: '6207a4ad48e6c1fceb13199d',
        name: 'Spiderman',
        description: 'Spiderman is a comic book superhero created by Stan Lee and Steve Ditko.',
        image: 'https://upload.wikimedia.org/wikipedia/en/2/21/Web_of_Spider',
        type: CollectionType.COMIC,
        visibility: CollectionVisibility.PUBLIC,
        admins: ['6207a4ad48e761fceb1313d9'],
        openItemUpdating: false,
        itemProperties: [
            {
                label: 'Name',
                type: ItemPropertyType.TEXT,
            },
        ],
    },
];
