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
    let t_x = hypotenuse * 0.5 / dx,
        t_y = hypotenuse * 0.5 / dy,
        t_z = hypotenuse * 0.5 / dz
    do {
        draw(x0, y0, z0)
        if (t_x < t_y) {
            if (t_x < t_z) {
                x0 += sx
                t_x += t_delta_x
            }
            else if (t_x > t_z) {
                z0 += sz
                t_z += t_delta_z
            }
            else {
                x0 += sx
                t_x += t_delta_x
                z0 += sz
                t_z += t_delta_z
            }
        } else if (t_x > t_y) {
            if (t_y < t_z) {
                y0 += sy
                t_y += t_delta_y
            }
            else if (t_y > t_z) {
                z0 += sz
                t_z += t_delta_z
            }
            else {
                y0 += sy
                t_y += t_delta_y
                z0 += sz
                t_z += t_delta_z
            }
        } else {
            if (t_y < t_z) {
                y0 += sy
                t_y += t_delta_y
                x0 += sx
                t_x += t_delta_x
            }
            else if (t_y > t_z) {
                z0 += sz
                t_z += t_delta_z
            }
            else {
                x0 += sx
                t_x += t_delta_x
                y0 += sy
                t_y += t_delta_y
                z0 += sz
                t_z += t_delta_z
            }
        }
    } while (
        t_x <= hypotenuse ||
        t_y <= hypotenuse ||
        t_z <= hypotenuse
    )
    draw(x0, y0, z0)
}