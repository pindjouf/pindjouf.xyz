import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: vercel({
            runtime: 'nodejs18.x'
        }),
    files: {
      assets: 'static'
    },
    prerender: {
      entries: ['*']
    }
  }
};

export default config;
