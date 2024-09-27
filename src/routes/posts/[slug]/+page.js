import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
    // fix ssr shit
	if (!import.meta.env.SSR) {
		return;
	}

	const { slug } = params;

	// path to post
	const postsDirectory = path.resolve('src/routes/posts');
	const fullPath = path.resolve(postsDirectory, `${slug}.md`);

	// check if file exists
	if (!fs.existsSync(fullPath)) {
		throw error(404, 'Not found');
	}

	// read md
	const markdownWithMeta = fs.readFileSync(fullPath, 'utf-8');
	const { content, data } = matter(markdownWithMeta);

	// convert md to HTML
	const htmlContent = marked(content);

	return {
		title: data.title,
		content: htmlContent
	};
}
