export async function GET() {
    const robotsTxt = `
# https://pindjouf.xyz/robots.txt
# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://pindjouf.xyz/sitemap.xml
`.trim();

    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}
