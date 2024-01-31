const data = '';
const canvasWidth = 824

const settings = {
    screenWidth: 128,
    screenHeight: 64,
    scaleToFit: true,
    preserveRatio: true,
    centerHorizontally: false,
    centerVertically: false,
    flipHorizontally: false,
    flipVertically: false,
    backgroundColor: 'white',
    scale: 1,
    drawMode: 'horizontal',
    removeZeroesCommas: false,
    ditheringThreshold: 128,
    ditheringMode: 0,
    outputFormat: 'plain',
    invertColors: false,
    rotation: 0,
};

function bitswap(b) {
    if (settings.bitswap) {
        // eslint-disable-next-line no-bitwise, no-mixed-operators, no-param-reassign
        b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
        // eslint-disable-next-line no-bitwise, no-mixed-operators, no-param-reassign
        b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
        // eslint-disable-next-line no-bitwise, no-mixed-operators, no-param-reassign
        b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
    }
    return b;
}

const horizontal1bit = (data, canvasWidth) => {
    let stringFromBytes = '';
    let outputIndex = 0;
    let byteIndex = 7;
    let number = 0;

    // format is RGBA, so move 4 steps per pixel
    for (let index = 0; index < data.length; index += 4) {
        // Get the average of the RGB (we ignore A)
        const avg = (data[index] + data[index + 1] + data[index + 2]) / 3;
        if (avg > 128) {
            number += 2 ** byteIndex;
        }
        byteIndex--;

        // if this was the last pixel of a row or the last pixel of the
        // image, fill up the rest of our byte with zeros so it always contains 8 bits
        if ((index !== 0 && (((index / 4) + 1) % (canvasWidth)) === 0) || (index === data.length - 4)) {
            // for(var i=byteIndex;i>-1;i--){
            // number += Math.pow(2, i);
            // }
            byteIndex = -1;
        }

        // When we have the complete 8 bits, combine them into a hex value
        if (byteIndex < 0) {
            let byteSet = bitswap(number).toString(16);
            if (byteSet.length === 1) { byteSet = `0${byteSet}`; }
            if (!settings.removeZeroesCommas) {
                stringFromBytes += `0x${byteSet}, `;
            } else {
                stringFromBytes += byteSet;
            }
            outputIndex++;
            if (outputIndex >= 16) {
                if (!settings.removeZeroesCommas) {
                    stringFromBytes += '\n';
                }
                outputIndex = 0;
            }
            number = 0;
            byteIndex = 7;
        }
    }
    console.log(stringFromBytes);
}
const data1 = atob(data)
console.log(data1);
const fs = require('fs');
fs.writeFile('abc.png', data1, err => console.log(err))

horizontal1bit(data1, canvasWidth);