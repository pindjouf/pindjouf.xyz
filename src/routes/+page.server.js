import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import { join } from 'path';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
    if (!import.meta.env.SSR) {
        return { groupedPosts: [] };
    }

    try {
        // Use import.meta.url to get the current file's path
        const currentDir = new URL('.', import.meta.url).pathname;
        const postsDirectory = join(currentDir, 'posts');

        const files = await readdir(postsDirectory);

        const posts = await Promise.all(
            files
                .filter(file => file.endsWith('.md'))
                .map(async (file) => {
                    const filePath = join(postsDirectory, file);
                    const markdownWithMeta = await readFile(filePath, 'utf-8');
                    const { data } = matter(markdownWithMeta);

                    return {
                        slug: file.replace('.md', ''),
                        title: data.title,
                        date: new Date(data.date)
                    };
                })
        );

        posts.sort((a, b) => b.date - a.date);

        const groupedPosts = posts.reduce((acc, post) => {
            const year = post.date.getFullYear();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(post);
            return acc;
        }, {});

        return { groupedPosts };
    } catch (err) {
        console.error('Error loading posts:', err);
        throw error(500, 'Error loading posts');
    }
}
