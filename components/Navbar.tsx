import Link from "next/link";
import { useEffect, useState } from "react";
import { BiCommentAdd, BiLogIn } from "react-icons/bi";
import req, { ReqParamInterface } from "../utils/req";

interface Props {
  isAuth: boolean;
  username?: string;
}

export default function Navbar(props: Props) {
  const [img, setImg] = useState("");
  useEffect(() => {
    const param: ReqParamInterface = {
      url: `/api/profile/${props.username}`,
      method: "get",
      result: ({ image: img }) => {
        setImg(img);
      },
    };
    req(param);
  }, []);
  return (
    <nav className="flex justify-between px-5 md:px-24  py-3 bg-primary text-secondary font-mono items-center">
      <Link href="/">
        <div className="cursor-pointer std-transition hover:text-secHov text-3xl font-semibold">arblo</div>
      </Link>
      <div className="text-3xl">
        {props.isAuth ? (
          <div className="flex gap-10">
            <Link href="/dash/post">
              <BiCommentAdd className="cursor-pointer std-transition hover:text-secHov" />
            </Link>
            <Link href={`/u/${props?.username}`}>
              {img == "" ? (
                <img className="border-2 hover:border-black w-[50px] h-[50px] rounded-full border-2 border-primary" src={`/anonim.png`} alt={"profile"} />
              ) : (
                <img className="border-2 hover:border-black w-[50px] h-[50px] rounded-full border-2 border-primary" src={`https://res.cloudinary.com/arblo/image/upload/c_fill,w_100/${img}`} alt={"profile"} />
              )}
            </Link>
          </div>
        ) : (
          <Link href="/login">
            <BiLogIn className="cursor-pointer std-transition hover:text-secHov" />
          </Link>
        )}
      </div>
    </nav>
  );
}
