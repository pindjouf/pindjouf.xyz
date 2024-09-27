<script>
    import "./style.css";
</script>

<div class="nav">
    <a href="https://twitter.com/pindjouf">Twitter</a>
    <a href="/" on:click={(e) => { e.preventDefault(); window.location.href = '/' }}>Blog</a>
    <a href="/logs">Logs</a>
    <a href="/roadmap">Roadmap</a>
    <hr>
</div>

<slot></slot>
