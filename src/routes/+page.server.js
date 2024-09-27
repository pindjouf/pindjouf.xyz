import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/** @type {import('./$types').PageLoad} */
export function load() {
    // Ensure server-side rendering
	if (!import.meta.env.SSR) {
		return;
	}

	// Use process.cwd() to ensure correct path resolution
	const postsDirectory = path.join(process.cwd(), 'src/routes/posts');

	// Check if the directory exists
	if (!fs.existsSync(postsDirectory)) {
		throw new Error(`Posts directory not found: ${postsDirectory}`);
	}

	const files = fs.readdirSync(postsDirectory);

	// Read markdown files and parse the data
	const posts = files
		.filter(file => file.endsWith('.md'))
		.map(file => {
			const filePath = path.join(postsDirectory, file);
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
