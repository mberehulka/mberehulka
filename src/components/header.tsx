export default function Header() {
	return (
		<div
			style={`
        width: 100%;
        height: 5rem;
        display: flex;
        align-items: center;
        padding-left: 2rem;
      `}
		>
			<div
				style={`
          display: flex;
          align-items: center;
          gap: 3em
        `}
			>
				<p class="text-1xl font-bold tracking-widest">Muriel Berehulka</p>
				<div
					class="text-gray-300 text-sm"
					style={`
						display: flex;
						align-items: center;
						gap: 3em
					`}
				>
					<a href="/">󰋜 Home</a>
					<a href="https://github.com/mberehulka"> Github</a>
					<a href="mailto:murielguedes@pm.me">󰇮 Contact</a>
				</div>
			</div>
		</div>
	)
}
