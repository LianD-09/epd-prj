import { NativeModules } from 'react-native';
import { encode } from 'base-64';

const config = {
    ditheringThreshold: 128,
    width: 128,     // px
    height: 296     //px
};

export const getByteArray = async (encode) => {
    const res = await NativeModules.Bitmap.getPixels(encode)
        .then((image) => {
            return image;
        })
        .catch((err) => {
            console.error(err);
        });

    return {
        width: res.width,
        height: res.height,
        pixels: res.pixels,
        hasAlpha: res.hasAlpha
    };
}

export const ditheringGrayscale = (byteArray) => {
    const lumR = [];
    const lumG = [];
    const lumB = [];
    for (let i = 0; i < 256; i++) {
        lumR[i] = i * 0.299;
        lumG[i] = i * 0.587;
        lumB[i] = i * 0.114;
    }
    // Convert to Greyscale luminance
    const pixelAverageRGB = Uint8ClampedArray.from(byteArray.map(it => {
        return Math.floor((
            lumR[Number("0x" + it.slice(2, 4))] +  // red
            lumG[Number("0x" + it.slice(4, 6))] +  // green
            lumB[Number("0x" + it.slice(6, 8))]    // blue
        ))
    }))

    // Dithering pixels - Floyd-Steinberg
    let err;
    const newPixelsArray = Uint8ClampedArray.from(pixelAverageRGB);

    for (let index = 0; index < newPixelsArray.length; index++) {
        let newPixel = newPixelsArray[index] < 129 ? 0 : 255;

        err = Math.floor((newPixelsArray[index] - newPixel) / 16);
        newPixelsArray[index] = newPixel;

        if ((index + 1) % config.width !== 0) {
            newPixelsArray[index + 1] += err * 7;
            if (index + config.width + 1 <= config.height * config.width) {
                newPixelsArray[index + config.width + 1] += err * 1;
            }
        }
        if (index % config.width !== 0) {
            if (index + config.width - 1 <= config.height * config.width) {
                newPixelsArray[index + config.width - 1] += err * 3;
            }
        }
        if (index + config.width <= config.height * config.width) {
            newPixelsArray[index + config.width] += err * 5;
        }
    };

    // Convert to 8-bit per pixel format
    let stringFromBytes = '';
    let byteIndex = 7;
    let number = 0;

    for (let index = 0; index < newPixelsArray.length; index++) {
        if (newPixelsArray[index] > config.ditheringThreshold) {
            number += 2 ** byteIndex;
        }
        byteIndex--;

        // if this was the last pixel of a row or the last pixel of the
        // image, fill up the rest of our byte with zeros so it always contains 8 bits
        if ((index !== 0 && ((index + 1) % (config.width)) === 0) || (index === newPixelsArray.length - 1)) {
            byteIndex = -1;
        }

        // When we have the complete 8 bits, combine them into a hex value
        if (byteIndex < 0) {
            stringFromBytes += String.fromCharCode(number);
            number = 0;
            byteIndex = 7;
        }
    }
    return encode(stringFromBytes);
}

