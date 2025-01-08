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
        <a href="/">Blog</a>
        <a href="https://twitter.com/pindjouf">Twitter</a>
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
