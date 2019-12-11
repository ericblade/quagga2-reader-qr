/// <reference types="cypress" />
const Quagga = require('@ericblade/quagga2');
const { default: QrCodeReader } = require('../../..');

Quagga.registerReader('qrcode', QrCodeReader);

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

describe('After registering QrCodeReader, decodeSingle functions correctly', () => {
    it('internal code128 reader still functions', () => {
        cy.fixture('code128.png').then(fixture => {
            return new Promise((resolve, reject) => {
                Quagga.decodeSingle({
                    ...config,
                    src: `data:image/png;base64,${fixture}`,
                }, (result: any) => {
                    resolve(result);
                });
            });
        })
        .should('have.all.keys', [
            'angle', 'box', 'boxes', 'codeResult', 'line', 'pattern', 'threshold',
        ])
        .should('have.property', 'codeResult')
        .should('have.property', 'code')
        .should('equal', 'Code 128');
    });
    it('QrCodeReader returns correct results from valid QR code image', () => {
        cy.fixture('qrcode.png').then(fixture => {
            return new Promise((resolve, reject) => {
                Quagga.decodeSingle({
                    ...config,
                    src: `data:image/png;base64,${fixture}`,
                }, (result: any) => {
                    // console.warn('**** result=', result);
                    resolve(result);
                });
            });
        })
        .should('have.all.keys', [
            'binaryData', 'chunks', 'codeResult', 'data', 'location',
        ])
        .should('have.property', 'codeResult')
        .should('have.all.keys', ['code', 'format'])
        .should('deep.equal', {
            code: 'https://qrs.ly/rbalywt',
            format: 'qr_code'
        });
    });
    it('decodeSingle returns null on junk image with no barcode/qrcode', () => {
        cy.fixture('junk.jpg').then(fixture => {
            return new Promise((resolve, reject) => {
                Quagga.decodeSingle({
                    ...config,
                    src: `data:image/jpg;base64,${fixture}`,
                }, (result: any) => {
                    console.warn('**** result=', result);
                    resolve(result);
                });
            });
        })
        .should('equal', null);
    });
});
