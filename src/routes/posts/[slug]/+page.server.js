import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    const { slug } = params;

    // Define the path to the posts folder
    const postsDirectory = path.resolve('src/routes/posts');
    const fullPath = path.resolve(postsDirectory, `${slug}.md`);

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
        throw error(404, 'Post not found');
    }

    // Read the markdown file
    const markdownWithMeta = fs.readFileSync(fullPath, 'utf-8');
    const { content, data } = matter(markdownWithMeta);

    // Convert markdown content to HTML
    const htmlContent = marked(content);

    return {
        title: data.title || slug,
        content: htmlContent
    };
}
