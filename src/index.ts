import jsQR from 'jsqr';
import { ImageWrapper } from '@ericblade/quagga2';

class QrCodeReader {
    // TODO: is FORMAT, _row, config, supplements actually necessary? check inside quagga to see if
    // they are used for anything? or if they are just customary.
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

    decodeImage(inputImageWrapper: ImageWrapper) {
        const data = inputImageWrapper.getAsRGBA();
        const result = jsQR(data, inputImageWrapper.size.x, inputImageWrapper.size.y);
        if (result === null) {
            return null;
        }
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
