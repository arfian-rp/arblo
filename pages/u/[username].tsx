import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiAccountCircleLine } from "react-icons/ri";
import Layout from "../../components/Layout";
import Post from "../../components/Post";
import PostModel, { PostInterface } from "../../model/PostModel";
import UserModel, { UserInterface } from "../../model/UserModel";
import connectDb from "../../utils/connectDb";
import req, { ReqParamInterface } from "../../utils/req";
import verifyToken from "../../utils/verifyToken";

const limit = 2;

interface Props {
  isAuth: boolean;
  userToken?: UserInterface;
  user?: UserInterface;
  posts: PostInterface[];
}
export default function Profile({ isAuth, userToken, user, posts: initialPosts }: Props) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [start, setStart] = useState(limit);

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
        /**
         * 1=> 0 2
         * 2=> 2 2
         */
      },
    };
    req(param);
  }

  window.addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    if (Math.ceil(scrolled) === scrollable) {
      if (user?.numberOfPosts! > limit) {
        load();
      }
    }
  });

  return (
    <Layout title={user?.username} description={`profile ${user?.username}`} isAuth={isAuth} username={userToken?.username}>
      <div className="flex flex-col px-5 md:px-24 border-2 border-b-primary font-semibold">
        <div className="s">
          <div>
            <div className="text-3xl px-3 flex justify-between w-full">
              <div className="flex items-center gap-5">
                <RiAccountCircleLine /> {user?.username!}
              </div>
              <div className="flex items-center gap-5 group px-5">
                <div className="flex flex-col items-center text-lg">
                  <div className="text-2xl">{user?.numberOfPosts}</div>
                  <div>Posts</div>
                </div>
                {userToken?.username! === user?.username ? (
                  <>
                    <BsThreeDotsVertical />
                    <div className="hidden group-hover:block absolute right-6 top-20 text-lg">
                      <div className="border-2 border-black bg-white">
                        {userToken?.username! === user?.username ? (
                          <div className="flex gap-2 px-5 border-2 border-black cursor-pointer hover:bg-primary">
                            <BiLogOut className="cursor-pointer text-red-500 text-3xl m-auto" onClick={logout} /> Logout
                          </div>
                        ) : (
                          <></>
                        )}
                        <div onClick={() => router.push(`/dash/edit-profile`)} className="border-2 border-black text-secondary px-5 hover:bg-primary cursor-pointer">
                          <div className="flex gap-1 items-center">
                            <MdOutlineModeEdit />
                            <div>Profile</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="m-1">Created date: {new Date(user?.createdAt!).toLocaleDateString()}</div>
          </div>
        </div>
        <div style={{ whiteSpace: "pre-line" }} className="text-lg my-5 md:w-[45vw]">
          {user?.bio}
        </div>
      </div>

      <div className="my-10">
        {posts.map((e: PostInterface) => (
          <Post key={e._id} _id={e._id!} title={e.title!} body={e.body!} author={e.author!} postedAt={e.postedAt!} mode={isAuth ? userToken?.username! === user?.username : false} reply={e.replys?.length} />
        ))}
        {/* <button onClick={() => load()}>load</button> */}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  connectDb();
  const posts = JSON.parse(JSON.stringify(await PostModel.find({ author: context.params?.username }).skip(0).limit(limit).sort({ postedAt: -1 })));
  const user = JSON.parse(JSON.stringify(await UserModel.findOne({ username: context.params?.username })));
  if (!user) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
      props: {},
    };
  }
  if (context.req.cookies.refreshToken) {
    try {
      const { userToken } = await verifyToken(context.req.cookies.refreshToken);
      if ("username" in userToken) {
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
