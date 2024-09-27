

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/logs/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.CUtw-8u0.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.stjccH-H.js"];
export const stylesheets = [];
export const fonts = [];
