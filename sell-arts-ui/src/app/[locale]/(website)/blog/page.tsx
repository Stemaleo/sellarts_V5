import Link from "next/link";

const Blog = async () => {
  return (
    <div>
      Blog page
      <Link href="/blog" locale="fr">
        To /fr/another
      </Link>
    </div>
  );
};

export default Blog;
