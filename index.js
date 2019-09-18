// import QrCode from 'qrcode-reader';
const QrCode = require('qrcode-reader');

const qr = new QrCode();

qr.grayscale = (imageData) => imageData; // override the qr.grayscale function, not sure exactly why, but the original code did that.. is this necessary?

const properties = {
    FORMAT: {
        value: 'qr_code',
        writeable: false,
    },
};

function QrCodeReader(config, supplements) {
    this._row = [];
    this.config = config || {};
    this.supplements = supplements;
    return this;
}

QrCodeReader.prototype = Object.create(QrCodeReader.prototype, properties);
QrCodeReader.prototype.constructor = QrCodeReader;

QrCodeReader.prototype.decodeImage = function (inputImageWrapper) {
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
        code: result.result,
    };
}

module.exports = QrCodeReader;
// export default QrCodeReader;
