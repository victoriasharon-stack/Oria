import { toGrayscale, stretchContrast, applyGamma } from './enhance.js';

export function runPipeline(imageData, opts = {}) {
  // Work on a copy so the original is never modified.
  let out = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );

  out = toGrayscale(out);
  out = stretchContrast(out);
  out = applyGamma(out, opts.gamma ?? 1);
  return out;
}
