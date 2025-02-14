export async function GET() {
    const robotsTxt = `01dd857ae12c4f69b4b29a0f144c355a`.trim();
    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}
