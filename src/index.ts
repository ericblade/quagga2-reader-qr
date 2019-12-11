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

    decodeImage(inputImageWrapper: { size: { x: any; y: any; }; data: any; get: any}) {
        const { x: width, y: height } = inputImageWrapper.size;
        const data = new Uint8ClampedArray(4 * inputImageWrapper.size.x * inputImageWrapper.size.y);
        // TODO: perhaps quagga should provide a function to do this, particularly since it already
        // has one that incorporates this
        for(let y = 0; y < width; y++) {
            for (let x = 0; x < height; x++) {
                const loc = y * height + x;
                const pix = inputImageWrapper.get(x, y);
                data[loc * 4] = pix;
                data[loc * 4 + 1] = pix;
                data[loc * 4 + 2] = pix;
                data[loc * 4 + 3] = 255;
            }
        }
        const result = jsQR(data, inputImageWrapper.size.x, inputImageWrapper.size.y);
        if (result === null) return null;
        // TODO: translate result.location into same values as box/boxes from other readers?
        console.warn('* returning from decodeImage');
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
