import { getAllPosts } from '$lib/posts';

export async function load() {
  const posts = await getAllPosts();
  
  const groupedPosts = posts.reduce((group, post) => {
    const year = new Date(post.date).getFullYear();
    if (!group[year]) {
      group[year] = [];
    }
    group[year].push(post);
    return group;
  }, {});

  return {
    groupedPosts
  };
}
