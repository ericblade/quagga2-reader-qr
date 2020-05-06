import { default as Quagga } from '@ericblade/quagga2';

import QrCodeReader from '../../../lib/browser/index';

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
            return Quagga.decodeSingle({
                ...config,
                src: `data:image/png;base64,${fixture}`,
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
            return Quagga.decodeSingle({
                ...config,
                src: `data:image/png;base64,${fixture}`,
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
    it('decodeSingle returns undefined on junk image with no barcode/qrcode', () => {
        cy.fixture('junk.jpg').then(fixture => {
            return Quagga.decodeSingle({
                ...config,
                src: `data:image/jpg;base64,${fixture}`,
            }).then(res => {
                // trap undefined and return null instead, because undefined return from here
                // tells cypress to use 'fixture' instead of 'undefined'
                if (res === undefined) {
                    return null;
                }
                return res;
            });
        })
        .should('equal', null);
    });
});

describe('served application can use decodeSingle to decode code-128 and qr-code', () => {
    it('code128', () => {
        cy.visit('localhost:3000').get('.barcode-result').contains('Code 128');
    });
    it('qrcode', () => {
        cy.visit('localhost:3000').get('.qrcode-result').contains('https://qrs.ly/rbalywt');
    });
});
