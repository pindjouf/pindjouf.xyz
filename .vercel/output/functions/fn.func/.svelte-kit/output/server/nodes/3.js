

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/posts/_slug_/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.mVKyic9b.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.stjccH-H.js"];
export const stylesheets = [];
export const fonts = [];
