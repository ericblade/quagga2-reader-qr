import { ImageWrapper } from '@ericblade/quagga2';
declare class QrCodeReader {
    FORMAT: {
        value: 'qr_code';
        writeable: false;
    };
    _row: [];
    config: {};
    supplements: any;
    constructor(config: {}, supplements: any);
    decodeImage(inputImageWrapper: ImageWrapper): {
        binaryData: number[];
        data: string;
        chunks: import("jsqr/dist/decoder/decodeData").Chunks;
        version: number;
        location: {
            topRightCorner: import("jsqr/dist/locator").Point;
            topLeftCorner: import("jsqr/dist/locator").Point;
            bottomRightCorner: import("jsqr/dist/locator").Point;
            bottomLeftCorner: import("jsqr/dist/locator").Point;
            topRightFinderPattern: import("jsqr/dist/locator").Point;
            topLeftFinderPattern: import("jsqr/dist/locator").Point;
            bottomLeftFinderPattern: import("jsqr/dist/locator").Point;
            bottomRightAlignmentPattern?: import("jsqr/dist/locator").Point | undefined;
        };
        codeResult: {
            code: string;
            format: "qr_code";
        };
    } | null;
    decodePattern(pattern: any): null;
}
export default QrCodeReader;
