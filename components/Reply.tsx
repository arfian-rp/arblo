import { useRouter } from "next/router";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiAccountCircleLine } from "react-icons/ri";
import req, { ReqParamInterface } from "../utils/req";

interface Props {
  _idPost: string;
  reply: {
    _id: string;
    body: string;
    author: string;
  };
  mode?: boolean;
}
export default function Reply({ reply, _idPost, mode = false }: Props) {
  const router = useRouter();
  function del() {
    const param: ReqParamInterface = {
      url: "/api/reply/delete",
      method: "delete",
      data: { _id: reply._id, _idPost },
      result: () => window.location.reload(),
    };
    if (confirm(`delete reply?`)) {
      req(param);
    }
  }

  return (
    <div className="relative mx-5 md:mx-24 lg:mx-[30vw] my-2 border-2 border-primary hover:border-secondary text-lg">
      <div className="border-2 border-b-primary text-left p-3 flex justify-between text-2xl cursor-pointer">
        <div onClick={() => router.push(`/u/${reply.author}`)} className="flex items-center gap-3 hover:text-secondary">
          <RiAccountCircleLine /> {reply.author}
        </div>
        {mode ? (
          <div className="px-5 group cursor-pointer">
            <BsThreeDotsVertical className="group-hover:hidden" />
            <div className="hidden group-hover:block absolute right-6 top-2">
              <div className="border-2 border-black bg-white">
                <div onClick={del} className="border-2 border-black text-secondary px-5 hover:bg-primary">
                  delete
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div style={{ whiteSpace: "pre-line" }} className="p-4 border-2 border-b-primary">
        {reply.body}
      </div>
      <div className="flex justify-end gap-2 items-center my-1 px-2">
        <div>{new Date(Number(reply._id)).toLocaleDateString()}</div>
      </div>
    </div>
  );
}
