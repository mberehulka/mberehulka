import { Head } from "$fresh/runtime.ts"
import { ErrorPageProps } from "$fresh/server.ts"

export default function Error500Page({ error }: ErrorPageProps) {
	return (
		<>
			<Head>
				<title>500 - Internal server error</title>
			</Head>
			<div class="bg-red-500 p-20 text-white leading-10">
				<p class="text-3xl">500 - Internal server error</p>
				<p class="text-gray-300">Error: {(error as Error).message}</p>
				<a href="/" class="underline">Go back home</a>
			</div>
		</>
	)
}
