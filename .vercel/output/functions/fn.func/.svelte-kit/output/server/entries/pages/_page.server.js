import fs from "fs";
import path from "path";
import matter from "gray-matter";
function load() {
  const postsDirectory = path.resolve("src/routes/posts");
  const files = fs.readdirSync(postsDirectory);
  const posts = files.filter((file) => file.endsWith(".md")).map((file) => {
    const filePath = path.resolve(postsDirectory, file);
    const markdownWithMeta = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(markdownWithMeta);
    return {
      slug: file.replace(".md", ""),
      title: data.title,
      date: new Date(data.date)
    };
  }).sort((a, b) => b.date - a.date);
  const groupedPosts = posts.reduce((acc, post) => {
    const year = post.date.getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});
  return {
    groupedPosts
  };
}
export {
  load
};
