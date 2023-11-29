import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ParsedUrlQuery } from "querystring";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useRouter } from "next/router";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePage: NextPage<Props> = ({ post }) => {
  //   const router = useRouter();

  //   if (router.isFallback) {
  //     return <p>Loading...</p>;
  //   }
  const { content, title } = post;
  return (
    <div className="max-w-3xl mx-auto ">
      <h1 className="font-semibold text-2xl py-5">{title}</h1>
      <div className="prose p-5">
        <MDXRemote {...content} />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  // reading paths
  const dirPathToRead = path.join(process.cwd(), "posts");
  const dirs = fs.readdirSync(dirPathToRead);
  const paths = dirs.map((filename) => {
    const filePathToRead = path.join(process.cwd(), "posts/" + filename);
    const fileContent = fs.readFileSync(filePathToRead, { encoding: "utf-8" });
    return { params: { postSlug: matter(fileContent).data.slug } };
  });

  // fallback options
  //  false => this will return 404 page for new unknown slug
  // blocking => this will first see the path slug and it will try to get data from staic pages and if there is no page it will first hang the browser and try to generate new page.
  // true => return the fake page for some time an once the data is ready it will serve them page props

  return {
    paths,
    fallback: "blocking",
  };
};

interface IStaticProps extends ParsedUrlQuery {
  postSlug: string;
}

type Post = {
  post: {
    title: string;
    content: MDXRemoteSerializeResult;
  };
};

export const getStaticProps: GetStaticProps<Post> = async (context) => {
  try {
    const { params } = context;
    const { postSlug }: any = params as IStaticProps;
    const filePathToRead = path.join(
      process.cwd(),
      "posts/" + postSlug + ".md"
    );
    const fileContent = fs.readFileSync(filePathToRead, { encoding: "utf-8" });
    const source: any = await serialize(fileContent, {
      parseFrontmatter: true,
    });
    return {
      props: {
        post: {
          content: source,
          title: source.frontmatter.title,
        },
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default SinglePage;
