"use strict";
exports.__esModule = true;
var adjustCover = function (state) {
    var first = state.order[0];
    if (first) {
        state.cover = state.data[first].imageData;
    }
    else {
        delete state.cover;
    }
};
function processStickerError(message, i18nKey) {
    var result = new Error(message);
    return result;
}
// Preload functions 
/*
const pify = require('pify');
const { readFile } = require('fs');
const sharp = require('sharp');

const STICKER_SIZE = 512;
const MIN_STICKER_DIMENSION = 10;
const MAX_STICKER_DIMENSION = STICKER_SIZE;
const MAX_WEBP_STICKER_BYTE_LENGTH = 100 * 1024;
const MAX_ANIMATED_STICKER_BYTE_LENGTH = 300 * 1024;

const {
  getAnimatedPngDataIfExists,
} = require('./ts/util/getAnimatedPngDataIfExists');

window.processStickerImage = async path => {
  const imgBuffer = await pify(readFile)(path);
  const sharpImg = sharp(imgBuffer);
  const meta = await sharpImg.metadata();

  const { width, height } = meta;
  if (!width || !height) {
    throw processStickerError(
      'Sticker height or width were falsy',
      'StickerCreator--Toasts--errorProcessing'
    );
  }

  let contentType;
  let processedBuffer;

  // [Sharp doesn't support APNG][0], so we do something simpler: validate the file size
  //   and dimensions without resizing, cropping, or converting. In a perfect world, we'd
  //   resize and convert any animated image (GIF, animated WebP) to APNG.
  // [0]: https://github.com/lovell/sharp/issues/2375
  const animatedPngDataIfExists = getAnimatedPngDataIfExists(imgBuffer);
  if (animatedPngDataIfExists) {
    if (imgBuffer.byteLength > MAX_ANIMATED_STICKER_BYTE_LENGTH) {
      throw processStickerError(
        'Sticker file was too large',
        'StickerCreator--Toasts--tooLarge'
      );
    }
    if (width !== height) {
      throw processStickerError(
        'Sticker must be square',
        'StickerCreator--Toasts--APNG--notSquare'
      );
    }
    if (width > MAX_STICKER_DIMENSION) {
      throw processStickerError(
        'Sticker dimensions are too large',
        'StickerCreator--Toasts--APNG--dimensionsTooLarge'
      );
    }
    if (width < MIN_STICKER_DIMENSION) {
      throw processStickerError(
        'Sticker dimensions are too small',
        'StickerCreator--Toasts--APNG--dimensionsTooSmall'
      );
    }
    if (animatedPngDataIfExists.numPlays !== Infinity) {
      throw processStickerError(
        'Animated stickers must loop forever',
        'StickerCreator--Toasts--mustLoopForever'
      );
    }
    contentType = 'image/png';
    processedBuffer = imgBuffer;
  } else {
    contentType = 'image/webp';
    processedBuffer = await sharpImg
      .resize({
        width: STICKER_SIZE,
        height: STICKER_SIZE,
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp()
      .toBuffer();
    if (processedBuffer.byteLength > MAX_WEBP_STICKER_BYTE_LENGTH) {
      throw processStickerError(
        'Sticker file was too large',
        'StickerCreator--Toasts--tooLarge'
      );
    }
  }

  return {
    path,
    buffer: processedBuffer,
    src: `data:${contentType};base64,${processedBuffer.toString('base64')}`,
    meta,
  };
};

*/
function myrun() {
    // These functions are tightly binded with reactjs or electron. Not sure what's the best way to decouple them.
    /*
    const stickerPaths = stickersDuck.useStickerOrder();
    const stickersReady = stickersDuck.useStickersReady();
    const haveStickers = stickerPaths.length > 0;*/
    console.log('myrun');
    var state = {
        order: [],
        data: {},
        title: '',
        author: '',
        packId: '',
        packKey: '',
        toasts: []
    };
}
myrun();
