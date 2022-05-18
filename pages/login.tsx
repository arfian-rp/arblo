import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import Layout from "../components/Layout";
import req, { ReqParamInterface } from "../utils/req";

export default function Login() {
  const [msg, setMsg] = useState("");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const param: ReqParamInterface = {
      url: "/api/auth/login",
      method: "post",
      data: {
        usernameOrEmail,
        password,
      },
      loading: () => setMsg("Loading..."),
      result: () => {
        setMsg("Success...");
        window.location.pathname = "/";
      },
      error: () => setMsg("Error..."),
    };
    req(param);
  }

  return (
    <Layout title="Login" description="login page" isAuth={false}>
      <div>
        <form onSubmit={login} className="flex flex-col gap-2 p-5 md:w-[33vw] border-2 border-primary mx-auto mt-[50vh] -translate-y-[75%] rounded-md">
          <div className="text-center text-3xl">Login</div>
          <div className="text-center">{msg}</div>
          <div className="flex items-center justify-between">
            <label htmlFor="username">Username:</label>
            <input value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value.toLowerCase())} className="input" type="text" id="username" placeholder="username/email" autoFocus />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="password">Password:</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="input" type="password" id="password" />
          </div>
          <div>
            <Link href="/register">
              <div className="link">Create Account?</div>
            </Link>
          </div>
          <div>
            <button className="btn" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (context.req.cookies.refreshToken) {
    try {
      const token = await jwt.verify(context.req.cookies.refreshToken, process.env.REFRESH_TOKEN!);
      if (token) {
        return {
          redirect: {
            permanent: true,
            destination: "/",
          },
          props: {},
        };
      }
      return {
        props: {},
      };
    } catch (e) {
      return {
        props: {},
      };
    }
  } else
    return {
      props: {},
    };
}
