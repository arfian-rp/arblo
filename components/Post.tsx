import React from "react";
import req, { ReqParamInterface } from "../utils/req";

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
  function del() {
    const param: ReqParamInterface = {
      url: "/api/post/delete",
      method: "delete",
      data: { _id },
      result: () => window.location.reload(),
    };
    req(param);
  }

  return (
    <div className="mx-5 md:mx-24 lg:mx-[30vw] my-2 border-2 border-primary text-lg">
      <div className="text-center text-2xl  border-2 border-b-primary  font-semibold cursor-pointer">{title}</div>
      <div style={{ whiteSpace: "pre-line" }} className="p-2 border-2 border-b-primary">
        {body}
      </div>
      <div className="text-center link">
        <a href={`/u/${author}`}>Written by {author}</a>
      </div>
      <div className="flex justify-between my-1 px-2">
        <div className="flex gap-2">
          <div>Reply: {reply}</div>
        </div>
        <div className="flex gap-2 items-center">
          {mode ? (
            <div>
              <button onClick={del} className="btnDel">
                Delete
              </button>
            </div>
          ) : (
            <></>
          )}
          <div>{new Date(postedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
