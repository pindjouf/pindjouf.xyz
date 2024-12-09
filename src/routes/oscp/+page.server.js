import { getAllPosts } from '$lib/oscp';

export const load = async () => {
    const allPosts = getAllPosts();

    const groupedPosts = allPosts.reduce((acc, post) => {
        const year = post.date.getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(post);
        return acc;
    }, {});

    for (const year in groupedPosts) {
        groupedPosts[year].sort((a, b) => b.date - a.date);
    }

    return {
        groupedPosts
    };
};
