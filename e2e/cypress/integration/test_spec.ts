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
            }, (result: any) => {
                // console.warn('**** result=', result);
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
    it.only('works', () => {
        cy.fixture('qrcode.png').then(fixture => {
            return new Promise((resolve, reject) => {
                Quagga.decodeSingle({
                    ...config,
                    src: `data:image/png;base64,${fixture}`,
                }, (result: any) => {
                    console.warn('**** result=', result);
                    resolve(cy.wrap(result));
                });
            });
        });
        // TODO: still need to figure out how to handle this test properly -- cypress is freezing
        // and it doesn't seem to be the fault of THIS library.
    });
});
