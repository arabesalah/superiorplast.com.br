const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', 'assets', 'images');

async function convert() {
  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true });
  const jpgs = entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.jpg'));
  console.log(`Encontradas ${jpgs.length} imagens .jpg para converter.`);

  for (const file of jpgs) {
    const input = path.join(srcDir, file.name);
    const output = input.replace(/\.jpg$/i, '.webp');
    try {
      const { size } = await fs.promises.stat(input);
      await sharp(input)
        .webp({ quality: 82, effort: 4 })
        .toFile(output);
      const { size: outSize } = await fs.promises.stat(output);
      console.log(`${file.name} -> ${path.basename(output)} (${(size / 1024).toFixed(1)}KB → ${(outSize / 1024).toFixed(1)}KB)`);
    } catch (err) {
      console.error(`Falha ao converter ${file.name}:`, err.message);
    }
  }
  console.log('Conversão finalizada.');
}

convert().catch((err) => {
  console.error('Erro inesperado:', err);
});
