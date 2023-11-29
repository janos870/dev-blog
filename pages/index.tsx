import { InferGetStaticPropsType, NextPage } from "next";
import BlogCard from "@/components/BlogCard";
import { readPostInfo } from "@/lib/helper";
import { PostApiResponse } from "@/utils/types";

export const getStaticProps = async () => {
  const postInfo: PostApiResponse = readPostInfo();
  return {
    props: { posts: postInfo },
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Blogs: NextPage<Props> = ({ posts }) => {
  return (
    <div className="max-w-3xl mx-auto p-5 space-y-5">
      {posts.map((post) => (
        <BlogCard
          key={post.slug}
          title={post.title}
          desc={post.meta}
          slug={post.slug}
        />
      ))}
    </div>
  );
};

export default Blogs;
