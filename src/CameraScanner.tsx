import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';
import { useEffect, useRef, useState } from 'react';

interface CameraScannerProps {
  hint: string;
  denied: string;
  closeLabel: string;
  onResult: (value: string) => void;
  onClose: () => void;
}

export function CameraScanner({ hint, denied, closeLabel, onResult, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let active = true;
    let handled = false;
    let stream: MediaStream | undefined;
    let controls: IScannerControls | undefined;

    async function start(preview: HTMLVideoElement) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!active) {
          for (const track of stream.getTracks()) track.stop();
          return;
        }

        const reader = new BrowserMultiFormatReader(new Map([[DecodeHintType.TRY_HARDER, true]]));
        controls = await reader.decodeFromStream(stream, preview, (result, _error, scanner) => {
          if (!active || !result || handled) return;
          handled = true;
          scanner.stop();
          onResult(result.getText());
        });
        if (!active) controls.stop();
      } catch {
        if (active) setError(true);
        for (const track of stream?.getTracks() ?? []) track.stop();
      }
    }

    void start(video);
    return () => {
      active = false;
      controls?.stop();
      for (const track of stream?.getTracks() ?? []) track.stop();
    };
  }, [onResult]);

  return (
    <div className="camera-backdrop" role="dialog" aria-modal="true" aria-label={hint}>
      <div className="camera-panel">
        <video ref={videoRef} muted playsInline autoPlay />
        {error && <p className="camera-error" role="alert">{denied}</p>}
        <p>{hint}</p>
        <button type="button" className="button button--secondary" aria-label={closeLabel} onClick={onClose}>×</button>
      </div>
    </div>
  );
}
