export async function GET() {
    const robotsTxt = `
# https://esaubukasa.com/robots.txt
# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://esaubukasa.com/sitemap.xml
`.trim();

    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}
