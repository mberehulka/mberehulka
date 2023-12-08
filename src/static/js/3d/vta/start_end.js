export default function (x0, y0, z0, x1, y1, z1, draw) {
    const dx = Math.abs(x1 - x0),
          dy = Math.abs(y1 - y0),
          dz = Math.abs(z1 - z0),
          sx = x0 < x1 ? 1 : -1,
          sy = y0 < y1 ? 1 : -1,
          sz = z0 < z1 ? 1 : -1,
          hypotenuse = Math.sqrt(dx * dx + dy * dy + dz * dz),
          t_delta_x = hypotenuse / dx,
          t_delta_y = hypotenuse / dy,
          t_delta_z = hypotenuse / dz
    let tx = hypotenuse * 0.5 / dx,
        ty = hypotenuse * 0.5 / dy,
        tz = hypotenuse * 0.5 / dz
    do {
        draw(x0, y0, z0)
        if (tx < ty) {
            if (tx < tz) {
                x0 += sx
                tx += t_delta_x
            }
            else if (tx > tz) {
                z0 += sz
                tz += t_delta_z
            }
            else {
                x0 += sx
                tx += t_delta_x
                z0 += sz
                tz += t_delta_z
            }
        } else if (tx > ty) {
            if (ty < tz) {
                y0 += sy
                ty += t_delta_y
            }
            else if (ty > tz) {
                z0 += sz
                tz += t_delta_z
            }
            else {
                y0 += sy
                ty += t_delta_y
                z0 += sz
                tz += t_delta_z
            }
        } else {
            if (ty < tz) {
                y0 += sy
                ty += t_delta_y
                x0 += sx
                tx += t_delta_x
            }
            else if (ty > tz) {
                z0 += sz
                tz += t_delta_z
            }
            else {
                x0 += sx
                tx += t_delta_x
                y0 += sy
                ty += t_delta_y
                z0 += sz
                tz += t_delta_z
            }
        }
    } while (
        tx <= hypotenuse ||
        ty <= hypotenuse ||
        tz <= hypotenuse
    )
    draw(x0, y0, z0)
}