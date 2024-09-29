import { getAllPosts } from '$lib/posts';

export const load = async () => {
    const allPosts = await getAllPosts();

    // Group posts by year
    const groupedPosts = allPosts.reduce((acc, post) => {
        const year = post.date.getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(post);
        return acc;
    }, {});

    return {
        groupedPosts
    };
};

