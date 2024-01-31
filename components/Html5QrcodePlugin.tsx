// file = Html5QrcodePlugin.jsx
import { Html5Qrcode } from 'html5-qrcode';
import { Html5QrcodeResult } from 'html5-qrcode/esm/core';
import { memo, useEffect } from 'react';

const readerId = 'html5qr-code-full-region';

type Html5QrcodePlugin = {
  onSuccessScan: (decodedText?: string, decodedResult?: Html5QrcodeResult) => void
  onErrorScan?: (errorMessage?: string) => void
  onError?: (errorMessage?: string) => void
};

let html5QrCode: Html5Qrcode;

const Html5QrcodePlugin = (props: Html5QrcodePlugin) => {

  useEffect(() => {
    if (!html5QrCode?.getState()) {
      html5QrCode = new Html5Qrcode(readerId);
      html5QrCode.start(
        { facingMode: "environment" }, 
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1
        },
        props.onSuccessScan,
        props.onErrorScan
      )
      .catch(props.onError)
    }

    return () => {
      if (html5QrCode?.isScanning) {
        html5QrCode.stop().catch(error => console.log(error))
      }
    }
  }, [props.onSuccessScan, props.onErrorScan, props.onError]);

    return (
      <div id={readerId} />
    );
};

export default memo(Html5QrcodePlugin);