import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { e as error } from "../../../../chunks/index.js";
function load({ params }) {
  const { slug } = params;
  const postsDirectory = path.resolve("src/routes/posts");
  const fullPath = path.resolve(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw error(404, "Not found");
  }
  const markdownWithMeta = fs.readFileSync(fullPath, "utf-8");
  const { content, data } = matter(markdownWithMeta);
  const htmlContent = marked(content);
  return {
    title: data.title,
    content: htmlContent
  };
}
export {
  load
};
