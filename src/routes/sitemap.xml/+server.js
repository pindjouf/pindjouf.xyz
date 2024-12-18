const site = 'https://pindjouf.xyz';

async function getPostData() {
    const posts = import.meta.glob('../posts/*.md', { eager: true });
    const postsData = [];
    
    for (const [path, post] of Object.entries(posts)) {
        const slug = path.split('/').pop().replace('.md', '');
        postsData.push({
            slug: `posts/${slug}`,
            lastmod: post.metadata.date
        });
    }
    
    return postsData;
}

function generateSitemap(pages) {
    const now = new Date().toISOString();
    
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
        <lastmod>${now}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${site}/roadmap</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${site}/projects</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- Dynamic pages (posts) -->
    ${pages.map(page => `
    <url>
        <loc>${site}/${page.slug}</loc>
        <lastmod>${new Date(page.lastmod).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;
}

export async function GET() {
    try {
        const postsData = await getPostData();
        const body = generateSitemap(postsData);
        
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
