import QrCode from 'qrcode-reader';
console.warn('* quagga2-reader-qr loaded');
class QrCodeReader {
    FORMAT: {
        value: 'qr_code',
        writeable: false,
    };
    _row: [];
    config: {};
    supplements: any;

    constructor(config: {}, supplements: any) {
        console.warn('* quagga2-reader-qr constructed');
        this._row = [];
        this.config = config || {};
        this.supplements = supplements;
        this.FORMAT = {
            value: 'qr_code',
            writeable: false,
        };
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
            // qrcode-reader throws strings :(
            if (error.startsWith("Couldn't find enough finder patterns:")) {
                return null;
            }
            throw new Error(error);
        }
        const result = qr.result;
        if (result === null) {
            return null;
        }
        return {
            codeResult: {
                code: result.result,
                points: result.points, // TODO: should probably be translated to Quagga's "box" return values
                format: this.FORMAT.value,
            },
        };
    }
}

export default QrCodeReader;
