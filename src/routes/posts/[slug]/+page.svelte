<script>
    export let data;
    const slug = data.slug;
    const filePath = './' + slug + '.md'

    import Post from "../where_x_equals_verilog.md";

    console.log(filePath);

    //Post = (await import(filePath)).default;
</script>

<Post />
