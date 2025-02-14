export async function GET() {
    const robotsTxt = `1f383515878f4f9a980ed0bafc77fdf9`.trim();
    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
}
