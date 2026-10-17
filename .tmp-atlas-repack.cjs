const sharp = require('/Users/jose/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

async function components(file, threshold = 24) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const seen = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  const found = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const start = y * w + x;
      if (seen[start] || data[start * 4 + 3] < threshold) continue;
      let head = 0, tail = 1, area = 0;
      let minx = x, maxx = x, miny = y, maxy = y;
      queue[0] = start; seen[start] = 1;
      while (head < tail) {
        const p = queue[head++], px = p % w, py = Math.floor(p / w);
        area++; minx = Math.min(minx, px); maxx = Math.max(maxx, px); miny = Math.min(miny, py); maxy = Math.max(maxy, py);
        if (px > 0) visit(p - 1); if (px + 1 < w) visit(p + 1); if (py > 0) visit(p - w); if (py + 1 < h) visit(p + w);
      }
      if (area > 500) found.push({ area, minx, maxx, miny, maxy, cx: (minx + maxx) / 2, cy: (miny + maxy) / 2, pixels: queue.slice(0, tail) });
      function visit(n) { if (!seen[n] && data[n * 4 + 3] >= threshold) { seen[n] = 1; queue[tail++] = n; } }
    }
  }
  const top = found.sort((a, b) => b.area - a.area).slice(0, 10);
  if (top.length !== 10) throw new Error(`Expected 10 creatures, found ${top.length} in ${file}`);
  top.sort((a, b) => (a.cy < h / 2 ? 0 : 1) - (b.cy < h / 2 ? 0 : 1) || a.cx - b.cx);
  return { data, w, h, top };
}

async function repack(input, output, threshold) {
  const { data, w, top } = await components(input, threshold);
  const parts = [];
  for (let i = 0; i < top.length; i++) {
    const comp = top[i], pad = 4;
    const left = Math.max(0, comp.minx - pad), topY = Math.max(0, comp.miny - pad);
    const width = comp.maxx - comp.minx + 1 + pad * 2, height = comp.maxy - comp.miny + 1 + pad * 2;
    const isolated = Buffer.alloc(width * height * 4);
    for (const p of comp.pixels) {
      const x = p % w, y = Math.floor(p / w), dst = ((y - topY) * width + (x - left)) * 4, src = p * 4;
      data.copy(isolated, dst, src, src + 4);
    }
    const cell = await sharp(isolated, { raw: { width, height, channels: 4 } })
      .resize(320, 320, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    parts.push({ input: cell, left: (i % 5) * 320, top: Math.floor(i / 5) * 320 });
  }
  await sharp({ create: { width: 1600, height: 640, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(parts).webp({ quality: 84, alphaQuality: 100, effort: 5 }).toFile(output);
}

repack(process.argv[2], process.argv[3], Number(process.argv[4] || 24)).then(() => console.log(process.argv[3])).catch(error => { console.error(error); process.exit(1); });
