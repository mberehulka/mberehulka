import { Handlers, PageProps } from "$fresh/server.ts"
import { Head } from "$x/fresh@1.5.2/runtime.ts"
import Post from "../components/post.tsx"
import { CSS, KATEX_CSS, render } from "$gfm"
import "https://esm.sh/prismjs@1.29.0/components/prism-typescript?no-check"
import "https://esm.sh/prismjs@1.29.0/components/prism-bash?no-check"
import "https://esm.sh/prismjs@1.29.0/components/prism-rust?no-check"
import "https://esm.sh/prismjs@1.29.0/components/prism-json?no-check"
import "https://esm.sh/prismjs@1.29.0/plugins/treeview/prism-treeview?no-check"

export const handler: Handlers<Post> = {
	async GET(_req, ctx) {
		const post = await Post.read(ctx.params.name)
		if (!post) return ctx.renderNotFound()
		return ctx.render(post)
	},
}

export default function PostPage({ data: post }: PageProps<Post>) {
	return (
		<>
			<Head>
				<title>{post.title}</title>
				<style>{CSS}{KATEX_CSS}</style>
			</Head>
			<div class="m-10">
				{post.render_page_header()}
				<article
					data-color-mode="dark" // dark | light | auto
					data-light-theme="light"
					data-dark-theme="dark"
					class="mt-8 markdown-body"
					dangerouslySetInnerHTML={{ __html: render(post.body) }}
				/>
			</div>
		</>
	)
}
