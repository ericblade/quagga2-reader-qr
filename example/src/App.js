import React, { useEffect, useState } from 'react';
import Quagga from '@ericblade/quagga2';
import QrCodeReader from '@ericblade/quagga2-reader-qr';
import './App.css';
import code128test from './code128.png';
import qrcodetest from './qrcode.png';

Quagga.registerReader('qrcode', QrCodeReader);

const qconfig = {
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

function App() {
  const [barcode, setBarcode] = useState(null);
  const [qrcode, setQrcode] = useState(null);

  // simultaneous decoding is BROKEN, see https://github.com/ericblade/quagga2/issues/5
  // useEffect(() => {
  //   Quagga.decodeSingle({
  //     ...qconfig,
  //     src: code128test,
  //   }, (result) => {
  //     console.warn('* result return 1', result.codeResult.code);
  //     setBarcode(result.codeResult.code);
  //   });
  // }, []);

  // useEffect(() => {
  //   Quagga.decodeSingle({
  //     ...qconfig,
  //     src: qrcodetest,
  //   }, (result) => {
  //     console.warn('* result return 2', result.codeResult.code);
  //     setQrcode(result.codeResult.code);
  //   });
  // }, []);

  useEffect(async () => {
    const [bc, qr] = await Promise.all([
      Quagga.decodeSingle({ ...qconfig, src: code128test }),
      Quagga.decodeSingle({ ...qconfig, src: qrcodetest }),
    ]);
    // const bc = await Quagga.decodeSingle({ ...qconfig, src: code128test });
    // const qr = await Quagga.decodeSingle({ ...qconfig, src: qrcodetest });
    setBarcode(bc.codeResult.code);
    setQrcode(qr.codeResult.code);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={code128test} />
        <div className="barcode-result">{barcode}</div>
        <img src={qrcodetest} />
        <div className="qrcode-result">{qrcode}</div>
      </header>
    </div>
  );
}

export default App;
