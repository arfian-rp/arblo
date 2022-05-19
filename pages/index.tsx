import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Post from "../components/Post";
import PostModel, { PostInterface } from "../model/PostModel";
import UserModel, { UserInterface } from "../model/UserModel";
import connectDb from "../utils/connectDb";
import req, { ReqParamInterface } from "../utils/req";
import { Token } from "../utils/token";

const limit = 10;

interface Props {
  isAuth: boolean;
  userToken?: Token;
  user?: UserInterface;
  count: number;
  posts: PostInterface[];
}
export default function Home({ isAuth, userToken, user, count, posts: initialPost }: Props) {
  const [posts, setPosts] = useState(initialPost);
  const [start, setStart] = useState(10);

  function load() {
    const param: ReqParamInterface = {
      url: `/api/post/get`,
      params: {
        limit,
        skip: start,
      },
      method: "post",
      result: ({ posts: newPost }) => {
        setPosts([...posts, ...newPost]);
        setStart(start + limit);
      },
    };
    req(param);
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      if (Math.ceil(scrolled) === scrollable) {
        if (count > limit) {
          load();
        }
      }
    });
  }, []);

  return (
    <Layout title="Arblo" isAuth={isAuth} username={user?.username}>
      <div className="my-10">
        {posts.map((e: PostInterface) => (
          <Post _id={e._id!} title={e.title!} body={e.body!} author={e.author!} postedAt={e.postedAt!} mode={userToken?.username! === e.author} reply={e.replys?.length} />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  connectDb();
  const count = await PostModel.countDocuments();
  const posts = JSON.parse(JSON.stringify(await PostModel.find().skip(0).limit(limit).sort({ postedAt: -1 })));
  if (context.req.cookies.refreshToken) {
    try {
      const token = JSON.parse(JSON.stringify(await jwt.verify(context.req.cookies.refreshToken, process.env.REFRESH_TOKEN!)));
      const userToken = JSON.parse(JSON.stringify(await UserModel.findOne({ username: token.username })));
      if (userToken) {
        return {
          props: {
            isAuth: true,
            userToken,
            token,
            count,
            posts,
          },
        };
      } else {
        return {
          props: {
            isAuth: false,
            count,
            posts,
          },
        };
      }
    } catch (e) {
      context.res.setHeader("Set-Cookie", "refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
      return {
        props: {
          isAuth: false,
          count,
          posts,
        },
      };
    }
  } else {
    return {
      props: {
        isAuth: false,
        count,
        posts,
      },
    };
  }
}
