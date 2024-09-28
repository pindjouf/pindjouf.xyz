import { error } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/posts'; // Adjust the import path accordingly

export async function load({ params }) {
    const { slug } = params;

    const post = getPostBySlug(slug); // Assuming this function reads from your markdown files

    if (!post) {
        throw error(404, 'Post not found');
    }

    return {
        props: { post }
    };
}
