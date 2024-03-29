import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoComment } from "react-icons/go";
import req, { ReqParamInterface } from "../utils/req";

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
  const [img, setImg] = useState("");
  const [gacc, setGacc] = useState(false);

  useEffect(() => {
    const param: ReqParamInterface = {
      url: `/api/profile/${author}`,
      method: "get",
      result: ({ image: img, gacc }) => {
        setImg(img);
        setGacc(gacc);
      },
    };
    req(param);
  }, []);

  function del() {
    const param: ReqParamInterface = {
      url: "/api/post/delete",
      method: "delete",
      data: { _id, image },
      result: () => (window.location.pathname = `/u/${author}`),
    };
    if (confirm(`delete '${title?`post: ${title}`:'this post'}'?`)) {
      req(param);
    }
  }

  return (
    <div className="text-lg mx-auto rounded-lg my-1 w-[350px] md:w-[600px] border-2 border-primary hover:border-black">
      <div className="text-center text-xl">
        <div className="text-left p-3 flex justify-between">
          <div onClick={() => router.push(`/u/${author}`)} className="flex items-center gap-3 hover:text-secondary cursor-pointer">
            {img == "" ? (
              <img className="border-2 hover:border-black w-[50px] h-[50px] rounded-full border-2 border-primary" src={`/anonim.png`} alt={"profile"} />
            ) : (
              <img className="border-2 hover:border-black w-[50px] h-[50px] rounded-full border-2 border-primary" src={`https://res.cloudinary.com/arblo/image/upload/c_fill,w_100/${img}`} alt={"profile"} />
            )}
            {gacc ? <div className="underline decoration-gaccCol">{author}</div> : <div>{author}</div>}
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
            <img className="border-2 hover:border-black w-[350px] md:w-[600px]" src={`https://res.cloudinary.com/arblo/image/upload/c_fill,w_600/${image}`} alt={title} />
          </div>
        ) : (
          <></>
        )}
        {title ? <div className="text-center text-2xl border-2 font-semibold">{title}</div> : <></>}
      </div>
      {body ? (
        <div style={{ whiteSpace: "pre-line" }} className="p-4">
          {body}
        </div>
      ) : (
        <></>
      )}
      <div className="flex justify-between my-1 px-2">
        <div onClick={() => router.push(`/p/${_id}`)} className="flex gap-2 items-center cursor-pointer">
          <GoComment className="text-2xl my-3" />: {reply}
        </div>
        <div className="flex gap-2 items-center cursor-pointer">
          <div>{new Date(postedAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
