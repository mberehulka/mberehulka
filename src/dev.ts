import dev from "$fresh/dev.ts"
import config from "./config/fresh.config.ts"

import "$std/dotenv/load.ts"

await dev(import.meta.url, "./main.ts", config)
