import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
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
    <Layout title="Edit Profile" isAuth={true} username={user.username}>
      <div>
        <form onSubmit={edit} className="flex flex-col gap-2 p-5 md:w-[33vw] border-2 border-primary mx-auto mt-[50vh] -translate-y-[75%] rounded-md">
          <div className="text-center text-3xl">Edit Profile</div>
          <div className="text-center">{msg}</div>
          <div className="flex items-center justify-between">
            <label htmlFor="username">Username:</label>
            <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="input" type="text" id="username" placeholder="lowercase" autoFocus />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="email">Email:</label>
            <input value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} className="input" type="email" id="email" placeholder="lowercase" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="bio">Bio:</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="textarea" placeholder="max 150 characters"></textarea>
          </div>
          <div>
            <button className="btn" type="submit">
              Edit
            </button>
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
