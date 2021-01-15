// Short term goal is to trigger sticker publish by running this function only

import { stickersDuck } from './sticker-creator/store';

function myrun () {
    // These functions are tightly binded with reactjs or electron. Not sure what's the best way to decouple them.
    /*
    const stickerPaths = stickersDuck.useStickerOrder();
    const stickersReady = stickersDuck.useStickersReady();
    const haveStickers = stickerPaths.length > 0;*/
    console.log('myrun');
}

myrun();