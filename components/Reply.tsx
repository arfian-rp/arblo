import { useRouter } from "next/router";
import req, { ReqParamInterface } from "../utils/req";
import { useEffect, useState } from "react";

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
  const [img, setImg] = useState("");

  useEffect(() => {
    const param: ReqParamInterface = {
      url: `/api/profile/${reply.author}`,
      method: "get",
      result: ({ image: img }) => {
        setImg(img);
      },
    };
    req(param);
  }, []);

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
    <div className="text-lg mx-auto rounded-lg my-1 w-[370px] md:w-[600px] border-2 border-primary hover:border-black">
      <div className="text-left p-3 flex justify-between text-xl cursor-pointer">
        <div onClick={() => router.push(`/u/${reply.author}`)} className="flex items-center gap-3 hover:text-secondary">
          {img == "" ? (
            <img className="border-2 hover:border-black w-[50px] h-[50px] rounded-full border-2 border-primary" src={`/anonim.png`} alt={"profile"} />
          ) : (
            <img className="border-2 hover:border-black w-[50px] h-[50px] rounded-full border-2 border-primary" src={`https://res.cloudinary.com/arblo/image/upload/c_fill,w_100/${img}`} alt={"profile"} />
          )}
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
