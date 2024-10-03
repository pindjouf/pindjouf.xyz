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
    <title>{post.title} | Pindjouf.xyz</title>
</svelte:head>

{#if Post}
    <Post />
{:else}
    <p>Loading...</p>
{/if}
