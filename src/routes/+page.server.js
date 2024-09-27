import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
    console.log('Starting load function');
    
    // Only run this on the server
    if (!import.meta.env.SSR) {
        console.log('Not SSR, returning empty groupedPosts');
        return { groupedPosts: {} };
    }

    try {
        const postsDirectory = path.join(process.cwd(), 'src', 'routes', 'posts');
        console.log('Posts Directory:', postsDirectory);
        console.log('Directory exists:', fs.existsSync(postsDirectory));

        const files = fs.readdirSync(postsDirectory);
        console.log('Files in posts directory:', files);

        const posts = files
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(postsDirectory, file);
                console.log('Processing file:', filePath);
                const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
                const { data } = matter(markdownWithMeta);
                console.log('Extracted frontmatter:', data);

                return {
                    slug: file.replace('.md', ''),
                    title: data.title,
                    date: new Date(data.date)
                };
            })
            .sort((a, b) => b.date - a.date);

        console.log('Parsed posts:', posts);

        const groupedPosts = posts.reduce((acc, post) => {
            const year = post.date.getFullYear();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(post);
            return acc;
        }, {});

        console.log('Grouped posts:', groupedPosts);

        return { groupedPosts };
    } catch (err) {
        console.error('Error loading posts:', err);
        throw error(500, 'Error loading posts');
    }
}
