import posts from './posts.json';

export function getAllPosts() {
    // Convert the date strings to Date objects
    return posts.map(post => ({
        ...post,
        date: new Date(post.date),
    }));
}
