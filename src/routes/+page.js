/** @type {import('./$types').PageLoad} */
export async function load() {
    const posts = import.meta.glob('./posts/*.md');

    const allPosts = await Promise.all(
        Object.entries(posts).map(async ([path, resolver]) => {
            const { metadata } = await resolver();
            return { ...metadata, slug: path.split('/').pop().replace('.md', '') };
        })
    );

    // ain't published = no show
    const publishedPosts = allPosts.filter(post => post.published !== false);

    // year grouping
    const groupedPosts = publishedPosts.reduce((acc, post) => {
        const year = new Date(post.date).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(post);
        return acc;
    }, {});

    return { groupedPosts };
}
