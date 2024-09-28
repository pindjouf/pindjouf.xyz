// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({
              runtime: 'nodejs18.x'
        }),
    prerender: {
      entries: ['*'] // Pre-render all routes and posts
    }
  }
};

export default config;
