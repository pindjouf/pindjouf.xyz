---
title: "Svelte first impressions"
date: "2024-09-30"
---

# Svelte first impressions

**TL;DR:** I remade my blog with sveltekit.

This is kind of a tutorial to use as a reference more than anything else.
You can find the source code to my blog here -> [repository](https://github.com/pindjouf/pindjouf.xyz).

## Why am I using svelte & sveltekit?

Their marketing is cool.

And I need:

- dynamic routing
- components/layouts/templates
- markdown preprocessor -- syntax highlighting

## Dynamic routing

Is easily achieved by having a [slug] directory in your routes

For example in my project it's done like this:
```
.
└── posts
    ├── achievements.md
    ├── assumption.md
    ├── belgian_sfg.md
    ├── chord_functionalities.md
    ├── comfy.md
    ├── copycat.md
    ├── hello_world.md
    ├── kayfabe.md
    ├── kof.md
    ├── [slug]
    │   ├── +layout.svelte
    │   ├── +page.js
    │   └── +page.svelte
    ├── svelte.md
    ├── t_shaped.md
    └── where_x_equals_verilog.md
```

Now my url can have any of these files' name and it will work ex: https://pindjouf.xyz/posts/kof or https://pindjouf.xyz/posts/kayfabe.

## Markdown preprocessor

There is a super easy way to do this with [mdsvex](https://mdsvex.com).

Set up your page like in this example:

```
.
├── +layout.svelte
├── +page.svelte
└── roadmap.md
```

Now to actually render the markdown put this in your `+page.svelte`:

```svelte
<script>
    import Roadmap from './roadmap.md';
</script>

<Roadmap />

```

Yes it's really that simple, it only takes 4 lines of *code*.

Now that's when you only need a static import, when you start getting dynamic that's where things get a little messy.

Since we can't use the same import statement, we have to pivot to the `import()` function.

First get the slug with a load function in a +page.js file:

```javascript
export const load = ({ params }) => {
    return {
        slug: params.slug
    }
}
```

Then you'll be able to use it in your +page.svelte:

```svelte
<script>
    import { onMount } from 'svelte';
    let Post;
    export let data;

    onMount(async () => {
        const slug = data.slug;
        const post = await import(`../${slug}.md`);
        Post = post.default;
    });
</script>

{#if Post}
    <Post />
{:else}
    <p>Loading...</p>
{/if}
```

### Syntax highlighting

Now for syntax highligting it's very simple, configure your svelte.config.js like so:

```svelte
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
```

Import a css file in your main css for the desired theme and you're good to go.

## Components -- templates

Components are fairly simple, you just create a svelte file like `Nav.svelte` they always start with a capital letter, I don't think it's necessary but it's definitely a convention.

Then you import it like we did with the markdown file at the start of the article.

Anything you need you can find in the [official docs](https://svelte.dev/docs/svelte-components) but here are the basic *rules* for making a component:

```svelte
<script>
	// logic goes here
</script>

<!-- markup (zero or more items) goes here -->

<style>
	/* styles go here */
</style>
```
