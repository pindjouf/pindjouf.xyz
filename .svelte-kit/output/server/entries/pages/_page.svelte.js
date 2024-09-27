import { c as create_ssr_component, d as each, e as escape, f as add_attribute } from "../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `${each(Object.keys(data.groupedPosts).sort((a, b) => b - a), (year) => {
    return `<h2>${escape(year)}</h2> ${each(data.groupedPosts[year], (post) => {
      return `<p>${escape(post.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))} -&gt; 
			<a${add_attribute("href", `/posts/${post.slug}`, 0)}>${escape(post.title)}</a> </p>`;
    })}`;
  })}`;
});
export {
  Page as default
};
