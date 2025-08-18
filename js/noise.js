import { smooth, lerp } from './utils.js';

export function hash3(i, j, k) {
  const s = Math.sin(i*127.1 + j*311.7 + k*74.7) * 43758.5453123;
  return s - Math.floor(s);
}
export function noise3(x, y, z) {
  const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z);
  const fx = x - i, fy = y - j, fz = z - k;
  const u = smooth(fx), v = smooth(fy), w = smooth(fz);
  const n000 = hash3(i, j, k), n100 = hash3(i+1, j, k), n010 = hash3(i, j+1, k), n110 = hash3(i+1, j+1, k);
  const n001 = hash3(i, j, k+1), n101 = hash3(i+1, j, k+1), n011 = hash3(i, j+1, k+1), n111 = hash3(i+1, j+1, k+1);
  const nx00 = lerp(n000, n100, u), nx10 = lerp(n010, n110, u), nx01 = lerp(n001, n101, u), nx11 = lerp(n011, n111, u);
  const nxy0 = lerp(nx00, nx10, v), nxy1 = lerp(nx01, nx11, v);
  return lerp(nxy0, nxy1, w);
}