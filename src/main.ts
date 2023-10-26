import { start } from "$fresh/server.ts"
import config from "./config/fresh.config.ts"
import manifest from "./fresh.gen.ts"

import "$std/dotenv/load.ts"

await start(manifest, config)
