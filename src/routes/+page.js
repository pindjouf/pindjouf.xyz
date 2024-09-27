/** @type {import('./$types').PageLoad} */
export function load({ data }) {
    return {
        groupedPosts: data.groupedPosts || [] // Use data from the server load
    };
}
