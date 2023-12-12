import { Handlers, PageProps } from "$fresh/server.ts"
import { Head } from "$x/fresh@1.5.2/runtime.ts"
import Post from "../components/post.tsx"

export const handler: Handlers<Post[]> = {
	async GET(_req, ctx) {
		return ctx.render(await Post.read_all())
	},
}

export default function Page(props: PageProps<Post[]>) {
	return (
		<>
			<Head>
			</Head>
			<div>
				<div class="flex flex-col px-5 pt-5">
					{props.data.map(post =>
						<div>
							{post.render_card()}
							<br></br>
							<br></br>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
