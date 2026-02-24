"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
// Quagga may have a dependency on the name of the property _row
const jsqr_1 = __importDefault(require("jsqr"));
class QrCodeReader {
    constructor(config, supplements) {
        this._row = [];
        this.config = config || {};
        this.supplements = supplements;
        this.FORMAT = {
            value: 'qr_code',
            writeable: false,
        };
        return this;
    }
    decodeImage(inputImageWrapper) {
        const data = inputImageWrapper.getAsRGBA();
        const result = (0, jsqr_1.default)(data, inputImageWrapper.size.x, inputImageWrapper.size.y);
        if (result === null) {
            return null;
        }
        // TODO: translate result.location into same values as box/boxes from other readers?
        return Object.assign({ codeResult: {
                code: result.data,
                format: this.FORMAT.value,
            } }, result);
    }
    // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
    decodePattern(pattern) {
        // STUB, this is probably meaningless to QR, but needs to be implemented for Quagga, in case
        // it thinks there's a potential barcode in the image
        return null;
    }
}
exports.default = QrCodeReader;
