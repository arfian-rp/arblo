import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { MdOutlineModeEdit } from "react-icons/md";
import Layout from "../../components/Layout";
import Post from "../../components/Post";
import PostModel, { PostInterface } from "../../model/PostModel";
import UserModel, { UserInterface } from "../../model/UserModel";
import connectDb from "../../utils/connectDb";
import req, { ReqParamInterface } from "../../utils/req";

const limit = 10;

interface Props {
  isAuth: boolean;
  userToken?: UserInterface;
  user?: UserInterface;
  posts: PostInterface[];
}
export default function Profile({ isAuth, userToken, user, posts: initialPosts }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [start, setStart] = useState(10);

  function logout() {
    const param: ReqParamInterface = {
      url: "/api/auth/logout",
      method: "post",
      result: () => {
        window.location.reload();
      },
    };
    if (confirm("Want to logout?")) {
      req(param);
    }
  }

  function load() {
    const param: ReqParamInterface = {
      url: `/api/post/get/${user?.username}`,
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
        if (user?.numberOfPosts! > limit) {
          load();
        }
      }
    });
  }, []);

  return (
    <Layout title={user?.username} description={`profile ${user?.username}`} isAuth={isAuth} username={userToken?.username}>
      <div className="flex flex-col px-5 md:px-24 border-2 border-b-primary font-semibold">
        <div className="flex justify-between">
          <div>
            <div className="text-3xl">{user?.username!}</div>
            <div className="m-1">Created date: {new Date(user?.createdAt!).toLocaleDateString()}</div>
            {userToken?.username! === user?.username ? (
              <button onClick={() => router.push("/dash/edit-profile")} className="btn m-1">
                <div className="flex gap-1 items-center">
                  <MdOutlineModeEdit />
                  <div>Profile</div>
                </div>
              </button>
            ) : (
              <></>
            )}
          </div>
          <div className="flex gap-5 items-center">
            {userToken?.username! === user?.username ? <BiLogOut className="cursor-pointer text-red-500 text-3xl" onClick={logout} /> : <></>}
            <div className="flex flex-col items-center text-lg">
              <div className="text-2xl">{user?.numberOfPosts}</div>
              <div>Posts</div>
            </div>
          </div>
        </div>
        <div style={{ whiteSpace: "pre-line" }} className="text-lg my-5 md:w-[45vw]">
          {user?.bio}
        </div>
      </div>

      <div className="my-10">
        {posts.map((e: PostInterface) => (
          <div key={e._id!} onClick={() => router.push(`/p/${e._id}`)}>
            <Post _id={e._id!} title={e.title!} body={e.body!} author={e.author!} postedAt={e.postedAt!} mode={isAuth ? userToken?.username! === user?.username : false} reply={e.replys?.length} />
          </div>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  connectDb();
  const posts = JSON.parse(JSON.stringify(await PostModel.find({ author: context.params?.username }).skip(0).limit(limit).sort({ postedAt: -1 })));
  const user = JSON.parse(JSON.stringify(await UserModel.findOne({ username: context.params?.username })));

  if (context.req.cookies.refreshToken) {
    try {
      const token = JSON.parse(JSON.stringify(await jwt.verify(context.req.cookies.refreshToken, process.env.REFRESH_TOKEN!)));
      const userToken = JSON.parse(JSON.stringify(await UserModel.findOne({ username: token.username })));
      if (userToken) {
        return {
          props: {
            isAuth: true,
            userToken,
            user,
            posts,
          },
        };
      } else {
        return {
          props: {
            isAuth: false,
            user,
            posts,
          },
        };
      }
    } catch (e) {
      context.res.setHeader("Set-Cookie", "refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
      return {
        props: {
          isAuth: false,
          user,
          posts,
        },
      };
    }
  } else {
    return {
      props: {
        isAuth: false,
        user,
        posts,
      },
    };
  }
}
