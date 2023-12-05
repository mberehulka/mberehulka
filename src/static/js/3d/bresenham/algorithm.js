export default function bresenham_3d(x0, y0, z0, x1, y1, z1, f) {
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1,
        dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1,
        dz = Math.abs(z1 - z0), sz = z0 < z1 ? 1 : -1,
        dm = Math.max(dx, dy, dz)
  let i = dm
  x1 = y1 = z1 = dm / 2
  while(true) {
     f(x0,y0,z0)
     if (i-- == 0) break;
     x1 -= dx; if (x1 <= 0) { x1 += dm; x0 += sx } 
     y1 -= dy; if (y1 <= 0) { y1 += dm; y0 += sy } 
     z1 -= dz; if (z1 <= 0) { z1 += dm; z0 += sz } 
  }
}