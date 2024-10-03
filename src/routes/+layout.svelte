<script>
    import "../style.css";
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
    import { dev } from '$app/environment';
    import { inject } from '@vercel/analytics';

    inject({ mode: dev ? 'development' : 'production' });
    injectSpeedInsights();
</script>

<div class="nav">
    <a href="https://twitter.com/pindjouf">Twitter</a>
    <a href="/" on:click={(e) => { e.preventDefault(); window.location.href = '/' }}>Blog</a>
    <a href="/logs">Logs</a>
    <a href="/roadmap">Roadmap</a>
    <hr>
</div>

<slot></slot>

<style>
    .nav {
        font-weight: bold;
    }
</style>
