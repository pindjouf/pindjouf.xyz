import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
    // Only run this on the server
    if (!import.meta.env.SSR) {
        return { groupedPosts: [] }; // Return an empty array if not SSR
    }

    // Correct path to posts directory
    const postsDirectory = path.join(process.cwd(), 'src', 'routes', 'posts');
    console.log('Posts Directory:', postsDirectory); // Debugging

    // Check if the directory exists
    if (!fs.existsSync(postsDirectory)) {
        console.error('Posts directory does not exist:', postsDirectory);
        throw error(404, 'Posts directory not found');
    }

    const files = fs.readdirSync(postsDirectory);

    // Read markdown files and parse the date
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
