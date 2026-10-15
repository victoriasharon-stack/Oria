import './style.css';
import { runPipeline } from './pipeline/index.js';
import { classify } from './pipeline/classify.js';

const fileInput = document.getElementById('file');
const gammaInput = document.getElementById('gamma');
const originalCanvas = document.getElementById('original');
const enhancedCanvas = document.getElementById('enhanced');
const output = document.getElementById('analysis-output');

let currentImage = null;

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  currentImage = await createImageBitmap(file);
  await render();
});

gammaInput.addEventListener('input', () => render());

async function render() {
  if (!currentImage) return;
  const { width, height } = currentImage;

  originalCanvas.width = enhancedCanvas.width = width;
  originalCanvas.height = enhancedCanvas.height = height;

  const octx = originalCanvas.getContext('2d', { willReadFrequently: true });
  octx.drawImage(currentImage, 0, 0);
  const source = octx.getImageData(0, 0, width, height);

  const result = runPipeline(source, { gamma: parseFloat(gammaInput.value) });
  enhancedCanvas.getContext('2d').putImageData(result, 0, 0);

  const { label, confidence } = await classify(source);
  output.textContent = `Result: ${label} (${(confidence * 100).toFixed(0)}%)`;
}
