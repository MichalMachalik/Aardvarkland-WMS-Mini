import { BrowserMultiFormatReader } from '@zxing/browser';
import { DecodeHintType } from '@zxing/library';

const maxFileBytes = 12 * 1024 * 1024;
const maxImageEdge = 1800;

export async function decodeScanImage(file: File): Promise<string> {
  if (file.size > maxFileBytes || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Unsupported barcode image');
  }

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();

    const scale = Math.min(1, maxImageEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Image decoding is unavailable');

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const reader = new BrowserMultiFormatReader(new Map([[DecodeHintType.TRY_HARDER, true]]));
    try {
      return reader.decodeFromCanvas(canvas).getText();
    } catch {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        pixels.data[index] = 255 - pixels.data[index];
        pixels.data[index + 1] = 255 - pixels.data[index + 1];
        pixels.data[index + 2] = 255 - pixels.data[index + 2];
      }
      context.putImageData(pixels, 0, 0);
      return reader.decodeFromCanvas(canvas).getText();
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}
