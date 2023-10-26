import { AppProps } from "$fresh/server.ts"
import { Partial } from "$fresh/runtime.ts"

export default function App({ Component }: AppProps) {
	return (
		<html>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Muriel Guedes</title>
			</head>
			<body f-client-nav>
				<Partial name="body">
					<Component />
				</Partial>
			</body>
		</html>
	)
}
