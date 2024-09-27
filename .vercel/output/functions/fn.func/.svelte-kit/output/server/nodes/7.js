import * as universal from '../entries/pages/posts/_slug_/_page.js';
import * as server from '../entries/pages/posts/_slug_/_page.server.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/posts/_slug_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/posts/[slug]/+page.js";
export { server };
export const server_id = "src/routes/posts/[slug]/+page.server.js";
export const imports = ["_app/immutable/nodes/7.tzgovVpw.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.stjccH-H.js"];
export const stylesheets = [];
export const fonts = [];
