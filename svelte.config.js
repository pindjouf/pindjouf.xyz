import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import rehypeHighlight from 'rehype-highlight';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.svx', '.md'],
    preprocess: mdsvex({
        extensions: ['.svx', '.md'],
        rehypePlugins: [rehypeHighlight], // Syntax highlighting plugin
    }),
    kit: {
        adapter: adapter({
            runtime: 'nodejs18.x',
        }),
    },
};

export default config;
