import jsQR from 'jsqr';

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
        this.FORMAT = {
            value: 'qr_code',
            writeable: false,
        };
        return this;
    }

    decodeImage(inputImageWrapper: { size: { x: any; y: any; }; data: any; get: any; getAsRGBA: any }) {
        const { x: width, y: height } = inputImageWrapper.size;
        const data = inputImageWrapper.getAsRGBA();
        const result = jsQR(data, inputImageWrapper.size.x, inputImageWrapper.size.y);
        console.warn('**** jsQR result=', result);
        if (!result) return null;
        // TODO: translate result.location into same values as box/boxes from other readers?
        return {
            codeResult: {
                code: result.data,
                format: this.FORMAT.value,
            },
            ...result,
        };
    }
}

export default QrCodeReader;
