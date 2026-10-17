const sharp = require('/Users/jose/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');

async function main(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const seen = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  const comps = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const start = y * w + x;
      if (seen[start] || data[start * 4 + 3] < 24) continue;
      let head = 0, tail = 1, area = 0;
      let minx = x, maxx = x, miny = y, maxy = y;
      queue[0] = start;
      seen[start] = 1;
      while (head < tail) {
        const p = queue[head++];
        const px = p % w, py = Math.floor(p / w);
        area++;
        minx = Math.min(minx, px); maxx = Math.max(maxx, px);
        miny = Math.min(miny, py); maxy = Math.max(maxy, py);
        if (px > 0) visit(p - 1);
        if (px + 1 < w) visit(p + 1);
        if (py > 0) visit(p - w);
        if (py + 1 < h) visit(p + w);
      }
      if (area > 500) comps.push({ area, minx, maxx, miny, maxy, cx: Math.round((minx + maxx) / 2), cy: Math.round((miny + maxy) / 2) });
      function visit(n) {
        if (!seen[n] && data[n * 4 + 3] >= 24) {
          seen[n] = 1;
          queue[tail++] = n;
        }
      }
    }
  }
  comps.sort((a, b) => b.area - a.area);
  console.log(JSON.stringify(comps.slice(0, 30), null, 2));
}

main(process.argv[2]).catch(error => { console.error(error); process.exit(1); });
