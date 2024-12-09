import posts from './oscp.json';

export function getAllPosts() {
    return posts.map(post => ({
        ...post,
        date: new Date(post.date),
    }));
}
