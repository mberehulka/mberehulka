import { Head } from "$fresh/runtime.ts"

export default function Error404() {
	return (
		<>
			<Head>
				<title>404 - Page not found</title>
			</Head>
			<div class="bg-red-500 p-20 text-white leading-10">
				<p class="text-3xl">404 - Page not found</p>
				<p class="text-gray-300">
					The page you were looking for doesn't exist.
				</p>
				<a href="/" class="underline">Go back home</a>
			</div>
		</>
	)
}
