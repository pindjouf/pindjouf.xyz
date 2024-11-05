<h3><a href="/" style="padding: 0;" on:click={(e) => { e.preventDefault(); window.location.href = '/' }}>Pindjouf.xyz</a></h3>

<slot></slot>

<style>
    a {
        color: var(--blue);
        text-decoration: var(--blue) none;
    }

    a:hover {
        text-decoration: var(--blue) underline;
    }
</style>
