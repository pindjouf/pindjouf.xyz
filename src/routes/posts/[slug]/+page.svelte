<script>
    export let data;
    $: ({ post, metadata } = data);
</script>

<svelte:head>
    <title>{metadata.title} | Pindjouf.xyz</title>
    <meta name="description" content={metadata.description} />
    <meta name="keywords" content={metadata.keywords} />
    
    <meta property="og:title" content={`${metadata.title} | Pindjouf.xyz`} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:image" content={metadata.ogImage} />
    <meta property="og:type" content="article" />
    
    <meta property="article:published_time" content={metadata.date} />
    {#if metadata.lastUpdated}
    <meta property="article:modified_time" content={metadata.lastUpdated} />
    {/if}
    <meta property="article:author" content={metadata.author} />
    {#each metadata.tags as tag}
    <meta property="article:tag" content={tag} />
    {/each}
    
    {#if metadata.canonicalUrl}
    <link rel="canonical" href={metadata.canonicalUrl} />
    {/if}
</svelte:head>

<article>
    <header class="article-header">
        <h1>{metadata.title}</h1>
        <div class="article-meta">
            <time datetime={metadata.date}>Published on {new Date(metadata.date).toLocaleDateString()}</time>
            {#if metadata.readingTime}
            <span>· {metadata.readingTime} min read</span>
            {/if}
        </div>
    </header>

    <svelte:component this={post} />

    {#if metadata.prevPost || metadata.nextPost}
    <nav class="post-navigation">
        {#if metadata.prevPost}
        <a href="/posts/{metadata.prevPost}" class="prev">← Previous Post</a>
        {/if}
        {#if metadata.nextPost}
        <a href="/posts/{metadata.nextPost}" class="next">Next Post →</a>
        {/if}
    </nav>
    <br>
    {/if}
</article>

<style>
    .article-header {
        margin-bottom: 2rem;
    }
    
    .article-meta {
        color: #666;
        margin: 0.5rem 0;
    }
    
    .post-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid 
#8b8b8b
;
    }
</style>
