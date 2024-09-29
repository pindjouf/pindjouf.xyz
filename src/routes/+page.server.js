import { getAllPosts } from '$lib/posts';

export const load = async () => {
    const allPosts = getAllPosts();

    // Group posts by year
    const groupedPosts = allPosts.reduce((acc, post) => {
        const year = post.date.getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(post);
        return acc;
    }, {});

    // Sort posts within each year by date
    for (const year in groupedPosts) {
        groupedPosts[year].sort((a, b) => b.date - a.date); // Sort descending by date
    }

    return {
        groupedPosts
    };
};
