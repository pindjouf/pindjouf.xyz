<script>
    import CopyCodeButton from '$lib/components/CopyCodeButton.svelte';
</script>

<CopyCodeButton buttonPosition="top-right" />
<slot />

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
