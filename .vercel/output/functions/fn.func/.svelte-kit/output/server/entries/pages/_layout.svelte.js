import { c as create_ssr_component } from "../../chunks/ssr.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="nav"><a href="https://twitter.com/pindjouf" data-svelte-h="svelte-1hsfimo">Twitter</a> <a href="/" data-svelte-h="svelte-1hnsops">Blog</a> <a href="/logs" data-svelte-h="svelte-psp6iv">Logs</a> <a href="/roadmap" data-svelte-h="svelte-1owwvr7">Roadmap</a> <hr></div> ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
