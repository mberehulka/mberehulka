import { render } from "$x/gfm@0.2.5/mod.ts"
import { join } from "$std/path/mod.ts"
import { existsSync } from "$std/fs/mod.ts"
import Hr from "./hr.tsx"

interface PostHeaders {
	title: string
	publishedAt: string
	snippet: string
}

function format_headers(text: string): PostHeaders {
	const res = {
		title: "Unknow",
		publishedAt: "2023-01-01",
		snippet: "---",
	}
	const lines = text.split("\n")
	for (const line of lines) {
		const [name, value] = line.split(":")
		switch (name.trim()) {
			case "title":
				res.title = value.trim()
				break
			case "publishedAt":
				res.publishedAt = value.trim()
				break
			case "snippet":
				res.snippet = value.trim()
				break
		}
	}
	return res
}

function format_md(text: string) {
	const sep = text.search("---")
	const headers = format_headers(text.slice(0, sep))
	const body = render(text.slice(sep))
	return { headers, body }
}

export default class Post {
	constructor(
		public readonly name = "",
		public readonly title = "",
		public readonly publishedAt = new Date(),
		public readonly snippet = "",
		public readonly body = "",
	) {}
	title_comp() {
		return <p class="text-2xl font-bold">{this.title}</p>
	}
	date_comp() {
		return (
			<p class="text-gray-400">
				{new Date(this.publishedAt).toLocaleDateString("en-us", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</p>
		)
	}
	static async read(name: string): Promise<Post | null> {
		const path = join("./posts", `${name}.md`)
		if (!existsSync(path)) return null
		const text = await Deno.readTextFile(path)
		const { headers, body } = format_md(text)
		return new Post(
			name,
			headers.title,
			new Date(headers.publishedAt),
			headers.snippet,
			body,
		)
	}
	static async read_all(): Promise<Post[]> {
		const files = Deno.readDir("./posts")
		const posts: Post[] = []
		for await (const file of files) {
			const name = file.name.replace(".md", "")
			const post = await Post.read(name)
			if (post) posts.push(post)
		}
		posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
		return posts
	}
	render_card() {
		return (
			<div>
				<a href={`/${this.name}`}>
					{this.title_comp()}
					{this.date_comp()}
					<p class="mt-4 text-gray-200">{this.snippet}</p>
				</a>
				<Hr />
			</div>
		)
	}
	render_page_header() {
		return (
			<div>
				{this.title_comp()}
				{this.date_comp()}
			</div>
		)
	}
}
