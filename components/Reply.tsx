import { useRouter } from "next/router";
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
    <div className="text-lg mx-auto rounded-lg my-1 w-[384px] md:w-[600px] border-2 border-primary hover:border-black">
      <div className="border-2 border-b-primary text-left p-3 flex justify-between text-2xl cursor-pointer">
        <div onClick={() => router.push(`/u/${reply.author}`)} className="flex items-center gap-3 hover:text-secondary">
          {reply.author}
        </div>
        {mode ? (
          <button onClick={del} className="text-sm text-center hover:border-red-500 text-red-500 w-16 ">
            delete
          </button>
        ) : (
          <></>
        )}
      </div>
      <div style={{ whiteSpace: "pre-line" }} className="p-4">
        {reply.body}
      </div>
      <div className="flex justify-end gap-2 items-center my-1 px-2">
        <div>{new Date(Number(reply._id)).toLocaleDateString()}</div>
      </div>
    </div>
  );
}
