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

<svelte:head>
    <title>{data.slug} | Pindjouf.xyz</title>
</svelte:head>

{#if Post}
    <Post />
{:else}
    <p>Loading...</p>
{/if}

<style>
    a {
        color: var(--blue);
        text-decoration: var(--blue) none;
    }

    a:hover {
        text-decoration: var(--blue) underline;
    }
</style>
