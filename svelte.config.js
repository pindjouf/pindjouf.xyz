import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: mdsvex(),
  kit: {
    adapter: adapter({
      runtime: 'nodejs18.x'
    }),
  }
};

export default config;
