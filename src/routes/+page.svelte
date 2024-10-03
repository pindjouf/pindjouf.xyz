<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

{#each Object.keys(data.groupedPosts).sort((a, b) => b - a) as year}
	<h2>{year}</h2>
	{#each data.groupedPosts[year] as post}
		<p>
			{post.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -> 
			<a href={`/posts/${post.slug}`} style="font-weight: bold;">{post.title}</a>
		</p>
	{/each}
{/each}
