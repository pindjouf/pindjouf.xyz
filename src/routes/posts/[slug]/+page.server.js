import fs from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';
import path from 'path';

/** @type {import('./$types').PageLoad} */
export const prerender = true;

export async function load({ params }) {
    const { slug } = params;
    const postsDirectory = path.join(process.cwd(), 'src', 'routes', 'posts');
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        throw error(404, 'Post not found');
    }

    const markdownWithMeta = fs.readFileSync(fullPath, 'utf-8');
    const { content, data } = matter(markdownWithMeta);
    const htmlContent = marked(content);

    return {
        title: data.title,
        content: htmlContent
    };
}
