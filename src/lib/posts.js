import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define the path where your markdown files are stored
const postsDirectory = path.join(process.cwd(), 'src/routes/posts');

// Get all posts, filtering out directories
export async function getAllPosts() {
  const filenames = fs.readdirSync(postsDirectory).filter((filename) => {
    const filePath = path.join(postsDirectory, filename);
    return fs.statSync(filePath).isFile(); // Only include files, skip directories
  });

  const allPosts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    // Ensure that the date is a JavaScript Date object
    const postDate = new Date(data.date);

    return {
      ...data,
      date: postDate, // Convert the string date to a Date object
      slug: filename.replace(/\.md$/, ''), // Remove the .md extension for the slug
    };
  });

  // Sort posts by date in descending order
  allPosts.sort((a, b) => b.date - a.date);

  return allPosts;
}

export function getPostBySlug(slug) {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.md`);

    return {
        slug: realSlug,
        path: fullPath
    };
}
