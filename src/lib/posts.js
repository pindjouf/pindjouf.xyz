// src/lib/getPosts.js
import posts from './posts.json'; // Adjust the path accordingly

export function getAllPosts() {
    // Convert the date strings to Date objects
    return posts.map(post => ({
        ...post,
        date: new Date(post.date),
    }));
}
