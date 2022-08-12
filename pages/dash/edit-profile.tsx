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
export default function Edit({ user }: Props) {
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);

  async function edit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const param: ReqParamInterface = {
      url: "/api/auth/edit",
      method: "post",
      data: {
        username,
        email,
        bio,
      },
      loading: () => setMsg("Loading..."),
      result: () => {
        const param: ReqParamInterface = {
          url: "/api/auth/new-token",
          method: "post",
          data: {
            username,
          },
          loading: () => setMsg("Loading..."),
          result: () => {
            setMsg("Success...");
            setTimeout(() => {
              window.location.pathname = `/u/${username}`;
            }, 55);
          },
          error: () => setMsg("Error Login"),
        };
        req(param);
      },
      error: () => setMsg("Username or Email has been registered"),
    };
    req(param);
  }

  return (
    <Layout title="Edit Profile" description="edit profile" isAuth={true} username={user.username}>
      <div>
        <form onSubmit={edit} className="border-2 border-black m-auto mt-16 flex flex-col gap-3 py-10 rounded-lg w-[384px] md:w-[600px]">
          <div className="text-center text-4xl cursor-pointer">Edit Profile</div>
          <div className="text-center text-xl cursor-pointer">{msg}</div>
          <div className="flex justify-center">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} placeholder="email" />
          </div>
          <div className="flex justify-center">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="flex justify-center">
            <Link href={"/"}>
              <button className="hover:border-red-400 text-red-400">Cancel</button>
            </Link>
            <button type="submit">Edit</button>
          </div>
        </form>
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
