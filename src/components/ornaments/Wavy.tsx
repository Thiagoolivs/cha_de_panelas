/** Contorno ondulado (moldura da foto no convite), gerado ao longo de um retângulo arredondado. */
export function wavyPath(w: number, h: number, amp = 4.5, step = 58, r = 30): string {
  const pts: [number, number][] = [];
  const per = 2 * (w + h - 4 * r) + 2 * Math.PI * r;
  const n = Math.round(per / 4);
  const at = (s: number): [number, number, number, number] => {
    // ponto e normal ao longo do perímetro (sentido horário, começando no topo)
    const segs: [number, (t: number) => [number, number, number, number]][] = [
      [w - 2 * r, (t) => [r + t, 0, 0, -1]],
      [(Math.PI * r) / 2, (t) => { const a = -Math.PI / 2 + t / r; return [w - r + r * Math.cos(a), r + r * Math.sin(a), Math.cos(a), Math.sin(a)]; }],
      [h - 2 * r, (t) => [w, r + t, 1, 0]],
      [(Math.PI * r) / 2, (t) => { const a = t / r; return [w - r + r * Math.cos(a), h - r + r * Math.sin(a), Math.cos(a), Math.sin(a)]; }],
      [w - 2 * r, (t) => [w - r - t, h, 0, 1]],
      [(Math.PI * r) / 2, (t) => { const a = Math.PI / 2 + t / r; return [r + r * Math.cos(a), h - r + r * Math.sin(a), Math.cos(a), Math.sin(a)]; }],
      [h - 2 * r, (t) => [0, h - r - t, -1, 0]],
      [(Math.PI * r) / 2, (t) => { const a = Math.PI + t / r; return [r + r * Math.cos(a), r + r * Math.sin(a), Math.cos(a), Math.sin(a)]; }],
    ];
    let rest = s;
    for (const [len, f] of segs) {
      if (rest <= len) return f(rest);
      rest -= len;
    }
    return segs[0][1](0);
  };
  for (let i = 0; i < n; i++) {
    const s = (i / n) * per;
    const [x, y, nx, ny] = at(s);
    const o = amp * Math.sin((s / step) * Math.PI * 2) - amp;
    pts.push([x + nx * o, y + ny * o]);
  }
  return "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
}
