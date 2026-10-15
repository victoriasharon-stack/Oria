// Each step takes an ImageData and returns it (mutated in place).

export function toGrayscale(img) {
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = g;
  }
  return img;
}

// Stretch the 1st-99th percentile range to 0-255.
export function stretchContrast(img, lowPct = 0.01, highPct = 0.99) {
  const d = img.data;
  const hist = new Uint32Array(256);
  for (let i = 0; i < d.length; i += 4) hist[d[i] | 0]++;

  const total = d.length / 4;
  let acc = 0;
  let lo = 0;
  let hi = 255;

  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= total * lowPct) { lo = v; break; }
  }
  acc = 0;
  for (let v = 0; v < 256; v++) {
    acc += hist[v];
    if (acc >= total * highPct) { hi = v; break; }
  }
  if (hi <= lo) return img;

  const scale = 255 / (hi - lo);
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.min(255, Math.max(0, (d[i] - lo) * scale));
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  return img;
}

export function applyGamma(img, gamma = 1) {
  const d = img.data;
  const lut = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) lut[v] = 255 * Math.pow(v / 255, 1 / gamma);
  for (let i = 0; i < d.length; i += 4) {
    const v = lut[d[i]];
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  return img;
}
