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

describe('CameraAccess', () => {
    describe('enumerateVideoDevices', () => {
        it('works', async () => {
            // TODO: if someone runs this test in live Chrome with no video devices, it should
            // fail .. hmm...
            const v = await Quagga.CameraAccess.enumerateVideoDevices();
            expect(v).to.be.an('Array');
            // to.be.an and have.all.keys apparently don't work on InputDeviceInfo objects :|
            // expect(v[0]).to.be.an('InputDeviceInfo');
            // expect(v[0]).to.have.all.keys(['deviceId','groupId','kind','label']);
            expect(v[0].deviceId).to.exist;
            expect(v[0].groupId).to.exist;
            expect(v[0].kind).to.exist;
            expect(v[0].label).to.exist;
        });
    });
    describe('request', () => {
        it('works', async () => {
            after(() => Quagga.CameraAccess.release());
            const video = document.createElement('video');
            await Quagga.CameraAccess.request(video, {});
            expect(video.srcObject).to.not.equal(null);
            // "as any" here to prevent typescript blowing up because it doesn't understand 'id' and
            // 'active' as members of MediaStream | MediaSource | Blob .. why?
            expect(((video?.srcObject) as any)?.id).to.be.a('string');
            expect(((video?.srcObject) as any)?.active).to.equal(true);
        });
    });
    describe('release', () => {
        it('works', async () => {
            const video = document.createElement('video');
            await Quagga.CameraAccess.request(video, {});
            Quagga.CameraAccess.release();
            expect(((video?.srcObject) as any)?.active).to.equal(false);
        });
    });
    describe('getActiveStreamLabel', () => {
        it('no active stream', () => {
            const x = Quagga.CameraAccess.getActiveStreamLabel();
            expect(x).to.equal('');
        });
        it('with active stream', async () => {
            after(() => Quagga.CameraAccess.release());
            const video = document.createElement('video');
            await Quagga.CameraAccess.request(video, {});
            const x = Quagga.CameraAccess.getActiveStreamLabel();
            const v = await Quagga.CameraAccess.enumerateVideoDevices();
            expect(x).to.equal(v[0].label);
        });
    });
});
