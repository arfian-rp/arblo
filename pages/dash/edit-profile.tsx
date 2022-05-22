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
      <div className="mx-10">
        <form onSubmit={edit} className="flex flex-col gap-2 p-5 md:w-[33vw] border-2 border-primary mx-auto mt-[50vh] -translate-y-[75%] rounded-md">
          <div className="text-center text-3xl">Edit Profile</div>
          <div className="text-center">{msg}</div>
          <div className="flex items-center justify-between">
            <label htmlFor="username">Username:</label>
            <input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="input w-[10rem]" type="text" id="username" placeholder="lowercase" autoFocus />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="email">Email:</label>
            <input value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} className="input w-[10rem]" type="email" id="email" placeholder="lowercase" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="bio">Bio:</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="textarea w-[10rem]" placeholder="max 150 characters"></textarea>
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
  connectDb();
  const { userToken } = await verifyToken(context.req.cookies.refreshToken);
  return {
    props: {
      user: userToken,
    },
  };
}
