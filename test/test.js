// import Quagga2 from '@ericblade/quagga2';
// import QrCodeReader from './index.js';

const { default: Quagga } = require('@ericblade/quagga2');
const { default: QrCodeReader } = require('..');

Quagga.registerReader('qrcode', QrCodeReader);

const config = {
    numOfWorkers: 0,
    inputStream: {
        size: 800,
        singleChannel: false,
    },
    decoder: {
        readers: ['code_128_reader', 'qrcode'],
    },
    locate: true,
    locator: {
        patchSize: 'medium',
        halfSample: true,
    },
};

config.src = './qrcode.png';

/* eslint-disable no-console */
Quagga.decodeSingle(config, (firstDecodeResult) => {
    console.warn('* qrcode test result=', firstDecodeResult);
    config.src = './code128.png';
    Quagga.decodeSingle(config, (secondDecodeResult) => {
        console.warn('* code128 test result=', secondDecodeResult);
    });
});
