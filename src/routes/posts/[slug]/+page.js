export async function load({ params }) {
    const post = await import(`../${params.slug}.md`);
    return {
        post: post.default,
        metadata: post.metadata
    };
}
