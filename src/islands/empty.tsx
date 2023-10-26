import { useSignal } from "@preact/signals"
import { hidden } from "$std/fmt/colors.ts"

// For some reason hot reload dont work without at least one island
export default function EmptyIsland() {
	const count = useSignal(0)
	return <div class="hidden">{count}</div>
}
