import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineModeEdit } from "react-icons/md";
import Layout from "../../components/Layout";
import PostComp from "../../components/PostComp";
import PostModel, { PostInterface } from "../../model/PostModel";
import UserModel, { UserInterface } from "../../model/UserModel";
import connectDb from "../../utils/connectDb";
import req, { ReqParamInterface } from "../../utils/req";
import verifyToken from "../../utils/verifyToken";

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
      },
    };
    req(param);
  }

  return (
    <Layout title={user?.username} description={`profile ${user?.username}`} isAuth={isAuth} username={userToken?.username}>
      <div className="relative flex flex-col px-5 mx-5 md:mx-24 lg:mx-[30vw] border-2 border-primary font-semibold rounded-lg w-[350px] md:w-[600px] hover:border-black">
        <div>
          <div>
            <div className="text-3xl px-3 flex justify-around gap-1 w-full">
              <div className="flex items-center gap-1">
                {user?.image == "" ? (
                  <img className="border-2 hover:border-black w-[50px] h-[50px] rounded-full border-2 border-primary" src={`/anonim.png`} alt={"profile"} />
                ) : (
                  <img className="border-2 hover:border-black w-[50px] h-[50px] rounded-full border-2 border-primary" src={`https://res.cloudinary.com/arblo/image/upload/c_fill,w_100/${user?.image}`} alt={"profile"} />
                )}
                <div className="text-xl">{user?.username!}</div>
              </div>
              <div className="flex items-center gap-5 group px-5">
                <div className="flex flex-col items-center text-lg">
                  <div className="text-xl">{user?.numberOfPosts}</div>
                  <div>Posts</div>
                </div>
                {userToken?.username! === user?.username ? (
                  <>
                    <BsThreeDotsVertical />
                    <div className="hidden group-hover:block absolute right-6 top-10 text-lg">
                      <div className="border-2 border-black bg-white">
                        <div onClick={logout} className="flex gap-2 px-5 border-2 border-black cursor-pointer hover:bg-primary">
                          <BiLogOut className="cursor-pointer text-red-500 text-3xl m-auto" /> Logout
                        </div>
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
        {user?.web ? (
          <div>
            <a className="link" href={user?.web!}>
              {new URL(user.web).hostname}
            </a>
          </div>
        ) : (
          <></>
        )}
        <div style={{ whiteSpace: "pre-line" }} className="text-lg my-5 md:w-[45vw]">
          {user?.bio}
        </div>
      </div>

      <div className="py-10">
        {posts.map((e: PostInterface) => (
          <PostComp key={e._id} _id={e._id!} image={e.image!} title={e.title!} body={e.body!} author={e.author!} postedAt={e.postedAt!} mode={isAuth ? userToken?.username! === user?.username : false} reply={e.replys?.length} />
        ))}
        {posts.length < user?.numberOfPosts! && (
          <div className="flex justify-center py-12">
            <button onClick={() => load()} className="btn text-lg">
              Load More
            </button>
          </div>
        )}
        <br />
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
