<script>
    import "../style.css";
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';
    import CopyCodeButton from '$lib/components/CopyCodeButton.svelte';

    inject({ mode: dev ? 'development' : 'production' });
    injectSpeedInsights();
</script>

<header>
    <nav class="nav">
        <a href="/" on:click={(e) => { e.preventDefault(); window.location.href = '/' }}>Blog</a>
        <a href="https://cryptoooor.com">My web app</a>
        <a href="https://twitter.com/pindjouf">Twitter</a>
        <a href="/roadmap">Roadmap</a>
        <a href="/projects">Projects</a>
        <hr>
    </nav>
</header>

<main>
    <slot />
</main>

<style>
    .nav {
        font-weight: bold;
    }
</style>
