import { AppProps } from "$fresh/server.ts"
import Counter from "../islands/empty.tsx"
import Header from "../components/header.tsx"

export default function App({ Component }: AppProps) {
	return (
		<html>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Muriel Berehulka</title>
				<link rel="stylesheet" href="css/main.css" />
			</head>
			<body class="bg-black text-white">
				<Counter />
				<Header />
				<Component />
			</body>
		</html>
	)
}
