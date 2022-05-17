import { GetServerSidePropsContext } from "next";
import React, { FormEvent, useState } from "react";
import Layout from "../../components/Layout";
import Post from "../../components/Post";
import PostModel, { PostInterface } from "../../model/PostModel";
import connectDb from "../../utils/connectDb";
import jwt from "jsonwebtoken";
import UserModel, { UserInterface } from "../../model/UserModel";
import Reply from "../../components/Reply";
import req, { ReqParamInterface } from "../../utils/req";

interface Props {
  post: PostInterface;
  userToken?: UserInterface;
  isAuth: boolean;
}
export default function PostDetile({ post, isAuth, userToken }: Props) {
  const [msg, setMsg] = useState("");
  const [body, setBody] = useState("");

  function reply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const param: ReqParamInterface = {
      url: `/api/reply/add`,
      method: "post",
      data: { _idPost: post._id, body },
      loading: () => setMsg("Loading..."),
      result: () => {
        setMsg("Success...");
        setTimeout(() => {
          window.location.reload();
        }, 55);
      },
      error: () => setMsg("Error..."),
    };
    if (!isAuth) {
      alert("you have to login");
    }
    req(param);
  }

  return (
    <Layout title={post.title} description={`${post.title}\npost: ${post.body}\nwritten by:${post.author}`} isAuth={isAuth} username={userToken?.username}>
      <Post _id={post._id!} title={post.title!} body={post.body!} author={post.author!} postedAt={post.postedAt!} reply={post.replys?.length!} mode={isAuth ? userToken?.username! === post?.author! : false} />
      <div className="my-10">
        {post.replys?.map((e, i) => (
          <Reply reply={e} key={i} _idPost={post._id!} mode={isAuth ? userToken?.username! === JSON.parse(JSON.stringify(e))?.author! : false} />
        ))}
      </div>
      {isAuth ? (
        <div className="flex justify-center mt-20 mx-5 md:mx-24 lg:mx-[30vw]">
          <form onSubmit={reply} className="flex flex-col gap-1 w-[100%]">
            <div className="text-center text-3xl">New Reply</div>
            <div className="text-center">{msg}</div>
            <div>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} className="textarea w-full h-40" placeholder="body"></textarea>
            </div>
            <div>
              <button className="btn" type="submit">
                Reply
              </button>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  connectDb();
  const post = JSON.parse(JSON.stringify(await PostModel.findOne({ _id: context.params?._id })));
  if (context.req.cookies.refreshToken) {
    try {
      const token = JSON.parse(JSON.stringify(await jwt.verify(context.req.cookies.refreshToken, process.env.REFRESH_TOKEN!)));
      const userToken = JSON.parse(JSON.stringify(await UserModel.findOne({ username: token.username })));
      if (userToken) {
        return {
          props: {
            isAuth: true,
            userToken,
            post,
          },
        };
      } else {
        return {
          props: {
            isAuth: false,
            post,
          },
        };
      }
    } catch (e) {
      context.res.setHeader("Set-Cookie", "refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
      return {
        props: {
          isAuth: false,
          post,
        },
      };
    }
  } else {
    return {
      props: {
        isAuth: false,
        post,
      },
    };
  }
}
