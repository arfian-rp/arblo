import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import React, { FormEvent, useState } from "react";
import Layout from "../../components/Layout";
import UserModel, { UserInterface } from "../../model/UserModel";
import connectDb from "../../utils/connectDb";
import req, { ReqParamInterface } from "../../utils/req";
import verifyToken from "../../utils/verifyToken";

interface Props {
  user: UserInterface;
}
export default function Post({ user }: Props) {
  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function post(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const param: ReqParamInterface = {
      url: "/api/post/add",
      method: "post",
      data: {
        title,
        body,
      },
      loading: () => setMsg("Loading..."),
      result: () => {
        setMsg("Success..");
        setTimeout(() => {
          window.location.pathname = "/";
        }, 55);
      },
      error: () => setMsg("Error"),
    };
    req(param);
  }
  return (
    <Layout title="Post" description="create new post" isAuth={true} username={user.username}>
      <div className="flex justify-center mt-[50vh] -translate-y-[75%]">
        <form onSubmit={post} className="flex flex-col gap-1 w-[70vw] md:w-[30vw]">
          <div className="text-center text-3xl">New Post</div>
          <div className="text-center">{msg}</div>
          <div>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className="input w-full text-left" type="text" placeholder="title..." />
          </div>
          <div>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className="textarea w-full h-40" placeholder="body..."></textarea>
          </div>
          <div>
            <button className="btn" type="submit">
              Post
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  connectDb();
  const { userToken } = await verifyToken(context.req.cookies.refreshToken);
  return {
    props: {
      user: userToken,
    },
  };
}
