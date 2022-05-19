import React from "react";
import req, { ReqParamInterface } from "../utils/req";
import { GoComment } from "react-icons/go";
import { RiAccountCircleLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/router";

interface Props {
  _id: string;
  title: string;
  body: string;
  author: string;
  postedAt: number;
  mode?: boolean;
  reply?: number;
}
export default function Post({ _id, title, body, author, postedAt, mode = false, reply }: Props) {
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
    <div className="relative mx-5 md:mx-24 lg:mx-[30vw] my-2 border-2 border-primary hover:border-secondary text-lg">
      <div className="text-center text-2xl">
        <div className="border-2 border-b-primary text-left p-3 flex justify-between">
          <div onClick={() => router.push(`/u/${author}`)} className="flex items-center gap-3 hover:text-secondary cursor-pointer">
            <RiAccountCircleLine /> {author}
          </div>
          <div className="px-5 group cursor-pointer">
            <BsThreeDotsVertical className="group-hover:hidden" />
            <div className="hidden group-hover:block absolute right-6">
              <div className="border-2 border-black bg-white">
                {mode ? (
                  <div onClick={del} className="border-2 border-black text-secondary px-5 hover:bg-primary">
                    delete
                  </div>
                ) : (
                  <></>
                )}
                <div onClick={() => router.push(`/p/${_id}`)} className="border-2 border-black text-secondary px-5 hover:bg-primary">
                  reply
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center text-2xl  border-2 border-b-primary font-semibold">{title}</div>
      </div>
      <div style={{ whiteSpace: "pre-line" }} className="p-4 border-2 border-b-primary">
        {body}
      </div>
      <div className="flex justify-between my-1 px-2">
        <div className="flex gap-2 items-center cursor-pointer">
          <GoComment className="text-2xl my-3" onClick={() => router.push(`/p/${_id}`)} />: {reply}
        </div>
        <div className="flex gap-2 items-center">
          <div>{new Date(postedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
