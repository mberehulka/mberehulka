export default function (x, y, z, dx, dy, dz, mt, draw) {
    const sx = dx > 0 ? 1 : -1,
          sy = dx > 0 ? 1 : -1,
          sz = dx > 0 ? 1 : -1,
          hypotenuse = Math.sqrt(dx * dx + dy * dy + dz * dz),
          t_delta_x = hypotenuse / dx,
          t_delta_y = hypotenuse / dy,
          t_delta_z = hypotenuse / dz
    let tx = hypotenuse * 0.5 / dx,
        ty = hypotenuse * 0.5 / dy,
        tz = hypotenuse * 0.5 / dz
    do {
        draw(x, y, z)
        if (tx < ty) {
            if (tx < tz) {
                x += sx
                tx += t_delta_x
            }
            else if (tx > tz) {
                z += sz
                tz += t_delta_z
            }
            else {
                x += sx
                tx += t_delta_x
                z += sz
                tz += t_delta_z
            }
        } else if (tx > ty) {
            if (ty < tz) {
                y += sy
                ty += t_delta_y
            }
            else if (ty > tz) {
                z += sz
                tz += t_delta_z
            }
            else {
                y += sy
                ty += t_delta_y
                z += sz
                tz += t_delta_z
            }
        } else {
            if (ty < tz) {
                y += sy
                ty += t_delta_y
                x += sx
                tx += t_delta_x
            }
            else if (ty > tz) {
                z += sz
                tz += t_delta_z
            }
            else {
                x += sx
                tx += t_delta_x
                y += sy
                ty += t_delta_y
                z += sz
                tz += t_delta_z
            }
        }
    } while (
        tx <= 1 ||
        ty <= 1 ||
        tz <= 1
    )
    draw(x, y, z)
}