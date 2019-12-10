/// <reference types="cypress" />
// import Quagga from '@ericblade/quagga2';
const Quagga = require('@ericblade/quagga2');
const { default: QrCodeReader } = require('../../..');

Quagga.registerReader('qrcode', QrCodeReader);
console.warn('* quagga=', QrCodeReader);

// import QrCodeReader from '../../../lib/browser/index.js';

const config = {
    numOfWorkers: 0,
    inputStream: {
        size: 800,
        singleChannel: false,
    },
    decoder: {
        readers: ['code_128_reader', 'qrcode']
    },
    locate: true,
    locator: {
        patchSize: 'medium',
        halfSample: true,
    },
};

describe('decodeSingle decodes a code_128 from a given image', () => {
    it('works', () => {
        const data = {};
        cy.fixture('code128.png').then(fixture => {
            Quagga.decodeSingle({
                ...config,
                src: `data:image/png;base64,${fixture}`
            }, (result) => {
                console.warn('**** result=', result);
                data.result = result;
            });
        });
        cy.wrap(data)
        .should('have.property', 'result')
        .should('have.all.keys', [
            'angle', 'box', 'boxes', 'codeResult', 'line', 'pattern', 'threshold',
        ])
        .should('have.property', 'codeResult')
        .should('have.property', 'code')
        .should('equal', 'Code 128');
    });
});

describe('decodeSingle decodes a QR code from a given image', () => {
    it('works', () => {
        const data = {};
        cy.fixture('qrcode.png').then(fixture => {
            Quagga.decodeSingle({
                ...config,
                src: `data:image/png;base64,${fixture}`,
                // src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/SIPI_Jelly_Beans_4.1.07.tiff/lossy-page1-256px-SIPI_Jelly_Beans_4.1.07.tiff.jpg',
            }, (result) => {
                console.warn('**** result=', result);
                data.result = result;
            })
        });
        cy.wrap(data)
        .should('have.property', 'result')
        .should('not.equal', undefined);
    });
});
