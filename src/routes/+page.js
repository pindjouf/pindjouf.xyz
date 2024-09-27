import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/** @type {import('./$types').PageLoad} */
export function load() {
    // fix ssr shit
	if (!import.meta.env.SSR) {
		return;
	}

	const postsDirectory = path.resolve('/posts');
	const files = fs.readdirSync(postsDirectory);

	// read md files and parse the date
	const posts = files
		.filter(file => file.endsWith('.md'))
		.map(file => {
			const filePath = path.resolve(postsDirectory, file);
			const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
			const { data } = matter(markdownWithMeta);

			return {
				slug: file.replace('.md', ''),
				title: data.title,
				date: new Date(data.date)
			};
		})
		.sort((a, b) => b.date - a.date);

	const groupedPosts = posts.reduce((acc, post) => {
		const year = post.date.getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push(post);
		return acc;
	}, {});

	return {
		groupedPosts
	};
}
