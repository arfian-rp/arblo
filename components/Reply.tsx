import React from "react";
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
  function del() {
    const param: ReqParamInterface = {
      url: "/api/reply/delete",
      method: "delete",
      data: { _id: reply._id, _idPost },
      result: () => window.location.reload(),
    };
    req(param);
  }

  return (
    <div className="mx-5 md:mx-24 lg:mx-[30vw] my-2 border-2 border-primary text-lg">
      <div style={{ whiteSpace: "pre-line" }} className="p-2 border-2 border-b-primary">
        {reply.body}
      </div>
      <div className="text-center link">
        <a href={`/u/${reply.author}`}>Reply from {reply.author}</a>
      </div>
      <div className="flex justify-end gap-2 items-center my-1 px-2">
        {mode ? (
          <div>
            <button onClick={del} className="btnDel">
              Delete
            </button>
          </div>
        ) : (
          <></>
        )}
        <div>{new Date(Number(reply._id)).toLocaleDateString()}</div>
      </div>
    </div>
  );
}
