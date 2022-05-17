import Link from "next/link";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { BiCommentAdd, BiLogIn } from "react-icons/bi";

interface Props {
  isAuth: boolean;
  username?: string;
}

export default function Navbar(props: Props) {
  return (
    <nav className="flex justify-between px-5 md:px-24  py-3 bg-primary text-secondary font-mono items-center">
      <Link href="/">
        <div className="cursor-pointer std-transition hover:text-secHov text-3xl">arfblo</div>
      </Link>
      <div className="text-3xl">
        {props.isAuth ? (
          <div className="flex gap-10">
            <Link href="/dash/post">
              <BiCommentAdd className="cursor-pointer std-transition hover:text-secHov" />
            </Link>
            <Link href={`/u/${props?.username}`}>
              <CgProfile className="cursor-pointer std-transition hover:text-secHov" />
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
