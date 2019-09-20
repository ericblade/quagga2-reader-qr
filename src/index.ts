import QrCode from 'qrcode-reader';

class QrCodeReader {
    FORMAT: {
        value: 'qr_code',
        writeable: false,
    };
    _row: [];
    config: {};
    supplements: any;

    constructor(config: {}, supplements: any) {
        this._row = [];
        this.config = config || {};
        this.supplements = supplements;
        return this;
    }

    decodeImage(inputImageWrapper: { size: { x: any; y: any; }; data: any; }) {
        const qr = new QrCode();
        qr.grayscale = (imageData: any) => imageData; // override the qr.grayscale function, not sure exactly why, but the original code did that.. is this necessary?
        qr.decode({
            width: inputImageWrapper.size.x,
            height: inputImageWrapper.size.y,
            data: inputImageWrapper.data
        });
        const error = qr.error;
        if (error) {
            console.error('* QrCodeReader error', error);
            return null;
        }
        const result = qr.result;
        if (result === null) {
            return null;
        }
        return {
            codeResult: {
                code: result.result,
                points: result.points, // TODO: should probably be translated to Quagga's "box" return values
            },
        };
    }
}

export default QrCodeReader;
