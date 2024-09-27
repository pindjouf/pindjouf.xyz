import { c as create_ssr_component } from "../../../../chunks/ssr.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h3><a href="/" style="padding: 0;" data-svelte-h="svelte-12gz6e">Pindjouf.xyz</a></h3> ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
