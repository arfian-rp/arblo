import React from "react";
import req, { ReqParamInterface } from "../utils/req";
import { GoComment } from "react-icons/go";
import { useRouter } from "next/router";
import Image from "next/image";

interface Props {
  _id: string;
  title: string;
  body: string;
  author: string;
  postedAt: number;
  mode?: boolean;
  reply?: number;
  image?: string;
}
export default function PostComp({ _id, title, body, author, postedAt, mode = false, reply, image }: Props) {
  const router = useRouter();

  function del() {
    const param: ReqParamInterface = {
      url: "/api/post/delete",
      method: "delete",
      data: { _id },
      result: () => (window.location.pathname = `/u/${author}`),
    };
    if (confirm(`delete post: '${title}'?`)) {
      req(param);
    }
  }

  return (
    <div className="border-2 border-black text-lg mx-auto rounded-lg my-1 w-[384px] md:w-[600px]">
      <div className="text-center text-2xl">
        <div className="text-left p-3 flex justify-between">
          <div onClick={() => router.push(`/u/${author}`)} className="flex items-center gap-3 hover:text-secondary cursor-pointer">
            {author}
          </div>
          {mode ? (
            <button onClick={del} className="text-sm text-center hover:border-red-500 text-red-500 w-16 ">
              delete
            </button>
          ) : (
            <></>
          )}
        </div>
        {image ? (
          <div className="mx-auto">
            <Image className="border-2 border-black w-[384px] md:w-[600px]" src={`https://res.cloudinary.com/arblo/image/upload/c_fill,w_600/${image}`} width={600} alt={title} />
          </div>
        ) : (
          <></>
        )}
        <div className="text-center text-2xl border-2 font-semibold">{title}</div>
      </div>
      <div style={{ whiteSpace: "pre-line" }} className="p-4">
        {body}
      </div>
      <div className="flex justify-between my-1 px-2">
        <button onClick={() => router.push(`/p/${_id}`)} className="flex gap-2 items-center">
          <GoComment className="text-2xl my-3" />: {reply}
        </button>
        <div className="flex gap-2 items-center cursor-pointer">
          <div>{new Date(postedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
