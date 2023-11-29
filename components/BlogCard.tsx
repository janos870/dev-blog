import Link from "next/link";
import { FC } from "react";

interface Props {
  title: string;
  slug: string;
  desc: string;
}

const BlogCard: FC<Props> = ({ title, desc, slug }) => {
  return (
    <Link className="p-2" href={"/blogs/" + slug}>
      <div className="bg-slate-100 p-2 rounded">
        <h1 className="text-gray-900 text-3xl font-semibold">{title}</h1>
        <p className="text-gray-500">{desc}</p>
      </div>
    </Link>
  );
};

export default BlogCard;
