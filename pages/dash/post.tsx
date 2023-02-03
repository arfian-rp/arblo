import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import Layout from "../../components/Layout";
import UserModel, { UserInterface } from "../../model/UserModel";
import connectDb from "../../utils/connectDb";
import req, { ReqParamInterface } from "../../utils/req";

interface Props {
  user: UserInterface;
}
export default function Post({ user }: Props) {
  // const [msg, setMsg] = useState("");
  // const [file, setFile] = useState<File>();
  // const [title, setTitle] = useState("");
  // const [body, setBody] = useState("");

  // function post(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   if (file) {
  //     formData.append("file", file);
  //   }
  //   if (title) {
  //     formData.append("title", title);
  //   }
  //   if (body) {
  //     formData.append("body", body);
  //   }
  //   const param: ReqParamInterface = {
  //     url: "/api/post/add",
  //     method: "post",
  //     data: formData,
  //     loading: () => setMsg("Loading..."),
  //     result: () => {
  //       setMsg("Success..");
  //       setTimeout(() => {
  //         window.location.pathname = "/";
  //       }, 55);
  //     },
  //     error: () => setMsg("Error"),
  //   };
  //   req(param);
  // }
  return (
    <Layout title="Post" description="create new post" isAuth={true} username={user.username}>
      <div className="m-auto mt-16 flex flex-col gap-3 py-10 rounded-lg w-[350px] md:w-[600px]">
        <div className="flex flex-col items-center">
          <Link href={"/dash/post_photo"}>
            <button className="mx-[1rem]">post photo</button>
          </Link>
          <Link href={"/dash/post_word"}>
            <button className="mx-[1rem]">post word</button>
          </Link>
        </div>
        {/* <form onSubmit={post} className="border-2 border-black m-auto mt-16 flex flex-col gap-3 py-10 rounded-lg w-[384px] md:w-[600px]">
          <div className="text-center text-4xl cursor-pointer">Create Post</div>
          <div className="text-center text-xl cursor-pointer">{msg}</div>
          <div className="flex justify-center">
            <input type="file" onChange={(e) => setFile(e.target.files![0])} accept="image/*" name="file" />
          </div>
          <div className="flex justify-center">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" name="title" />
          </div>
          <div className="flex justify-center">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="body" />
          </div>
          <div className="flex justify-center">
            <Link href={"/"}>
              <button className="hover:border-red-400 text-red-400">Cancel</button>
            </Link>
            <button type="submit">Post</button>
          </div>
        </form> */}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const token = JSON.parse(JSON.stringify(await jwt.verify(context.req.cookies.refreshToken, process.env.REFRESH_TOKEN!)));
    if (token) {
      connectDb();
      const user = JSON.parse(JSON.stringify(await UserModel.findOne({ _id: token._id })));
      if (user) {
        return {
          props: {
            user,
          },
        };
      } else {
        return {
          redirect: {
            permanent: true,
            destination: "/",
          },
          props: {},
        };
      }
    } else {
      return {
        redirect: {
          permanent: true,
          destination: "/",
        },
        props: {},
      };
    }
  } catch (e) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
      props: {},
    };
  }
}
