import { render } from "$x/gfm@0.2.5/mod.ts"
import { join } from "$std/path/mod.ts"
import { existsSync } from "$std/fs/mod.ts"
import Hr from "./hr.tsx"

interface PostHeaders {
	title: string
	publishedAt: string
	snippet: string
	after_body_scripts: Array<string>
}

function format_headers(text: string): PostHeaders {
	const res: PostHeaders = {
		title: "Unknow",
		publishedAt: "2023-01-01",
		snippet: "---",
		after_body_scripts: [],
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
			case "after-body-script":
				res.after_body_scripts.push(value.trim())
				break
		}
	}
	return res
}

function format_md(text: string) {
	const sep = text.search("---")
	const headers = format_headers(text.slice(0, sep))
	let body = render(text.slice(sep), {
		allowIframes: true,
		allowMath: true,
		disableHtmlSanitization: true,
	})

	for (const src of headers.after_body_scripts) {
		body += `<script src="js/${src}" type="module"></script>`
	}

	return { headers, body }
}

export default class Post {
	constructor(
		public readonly name = "",
		public readonly title = "",
		public readonly publishedAt = new Date(),
		public readonly snippet = "",
		public readonly body = "",
		public readonly last_change = new Date(),
	) {}
	title_comp() {
		return <p class="text-2xl font-bold">{this.title}</p>
	}
	date_comp(show_hint = false) {
		return (
			<p class="text-gray-400">
				{show_hint ? "Created at: " : ""}
				{new Date(this.publishedAt).toLocaleDateString("en-us", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</p>
		)
	}
	date_last_change(show_hint = false) {
		return (
			<p class="text-gray-400">
				{show_hint ? "Last change: " : ""}
				{new Date(this.last_change).toLocaleDateString("en-us", {
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
		const stats = await Deno.stat(path)
		const last_change = stats.mtime || stats.birthtime
		const { headers, body } = format_md(text)
		return new Post(
			name,
			headers.title,
			new Date(headers.publishedAt),
			headers.snippet,
			body,
			last_change || new Date(),
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
				<div class="text-gray-200">{this.snippet}</div>
				{this.date_comp(true)}
				{this.date_last_change(true)}
			</div>
		)
	}
}
