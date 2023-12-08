export default function (x, y, z, dx, dy, dz, max_dis, draw) {
    const sx = dx > 0 ? 1 : -1,
          sy = dy > 0 ? 1 : -1,
          sz = dz > 0 ? 1 : -1,
          t_delta_x = Math.abs(1 / dx),
          t_delta_y = Math.abs(1 / dy),
          t_delta_z = Math.abs(1 / dz)
    let tx = Math.abs(0.5 / dx),
        ty = Math.abs(0.5 / dy),
        tz = Math.abs(0.5 / dz)
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
        tx <= max_dis ||
        ty <= max_dis ||
        tz <= max_dis
    )
    draw(x, y, z)
}