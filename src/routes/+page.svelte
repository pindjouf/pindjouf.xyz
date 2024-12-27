<script>
    /** @type {import('./$types').PageData} */
    export let data;
    
    // post count
    const totalPosts = Object.values(data.groupedPosts)
        .flat()
        .length;
    
    // latest post date
    const latestPost = Object.values(data.groupedPosts)
        .flat()
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    // years covered
    const years = Object.keys(data.groupedPosts).sort((a, b) => b - a);
    
    // categories/tags from all posts
    const allTags = [...new Set(
        Object.values(data.groupedPosts)
            .flat()
            .map(post => post.tags)
            .flat()
            .filter(Boolean)
    )];


</script>

<svelte:head>
    <title>Pindjouf's Blog | Feels & Computer Things</title>
    <meta name="description" content="Explore {totalPosts} articles about software development, hardware engineering, travel experiences, and personal growth. Updated regularly with new insights and adventures." />
    
    <!-- Open Graph -->
    <meta property="og:title" content="Feels & Computer Things" />
    <meta property="og:description" content="A collection of {totalPosts} articles covering technology, travel, and personal development. From coding tutorials to Asian adventures." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://pindjouf.xyz" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Feels & Computer Things" />
    <meta name="twitter:description" content="Regular writings about software development, hardware engineering, world travels, and personal growth experiences." />
    
    <!-- Additional SEO -->
    <meta name="keywords" content="blog, technology, travel, software development, hardware engineering, personal growth, {allTags.join(', ')}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://pindjouf.xyz" />
</svelte:head>

<style>
    h2 {
        border-bottom: unset;
    }
</style>

{#each Object.keys(data.groupedPosts).sort((a, b) => b - a) as year}
    <h2>{year}</h2>
    {#each data.groupedPosts[year].sort((a, b) => new Date(b.date) - new Date(a.date)) as post}
        <p>
            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -> 
            <a href={`/posts/${post.slug}`} style="font-weight: bold;">{post.title}</a>
        </p>
    {/each}
{/each}
