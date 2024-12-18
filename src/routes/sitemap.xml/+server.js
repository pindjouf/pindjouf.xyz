const site = 'https://pindjouf.xyz';

async function getPostSlugs() {
    const posts = Object.entries(import.meta.glob('../posts/*.md'));
    const slugs = [];
    
    for (const [path] of posts) {
        const slug = path.split('/').pop().replace('.md', '');
        slugs.push(`posts/${slug}`);
    }
    
    return slugs;
}

function generateSitemap(pages) {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
    <!-- Static pages -->
    <url>
        <loc>${site}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${site}/roadmap</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${site}/projects</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- Dynamic pages (posts) -->
    ${pages.map(page => `
    <url>
        <loc>${site}/${page}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;
}

export async function GET() {
    try {
        const postSlugs = await getPostSlugs();
        
        const body = generateSitemap(postSlugs);
        
        return new Response(body, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'max-age=0, s-maxage=3600'
            }
        });
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return new Response('Error generating sitemap', { status: 500 });
    }
}
