import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    // Only run this on the server
    if (!import.meta.env.SSR) {
        return { title: '', content: '' }; // Return default values if not SSR
    }

    const { slug } = params;
    const fullPath = path.resolve(`src/routes/posts/${slug}.md`); // Path to the markdown file

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
        throw error(404, 'Not found');
    }

    // Read markdown file
    const markdownWithMeta = fs.readFileSync(fullPath, 'utf-8');
    const { content, data } = matter(markdownWithMeta);
    const htmlContent = marked(content);

    return {
        title: data.title,
        content: htmlContent
    };
}
