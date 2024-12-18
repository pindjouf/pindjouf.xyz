import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import rehypeHighlight from 'rehype-highlight';
import remarkSlug from 'remark-slug';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.svx', '.md'],
    preprocess: mdsvex({
        extensions: ['.svx', '.md'],
        rehypePlugins: [rehypeHighlight], // Syntax highlighting plugin
        remarkPlugins: [remarkSlug], // Heading ID generator plugin
    }),
    kit: {
        adapter: adapter({
            runtime: 'nodejs18.x',
        }),
    },
    prerender: {
        enabled: true,
        craw: true,
    },
};

export default config;
