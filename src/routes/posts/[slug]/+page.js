/** @type {import('./$types').PageLoad} */
export function load({ data }) {
    return {
        title: data.title || 'Untitled',
        content: data.content || ''
    };
}
