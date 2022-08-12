import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import Layout from "../components/Layout";
import req, { ReqParamInterface } from "../utils/req";
import verifyToken from "../utils/verifyToken";

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
        <form onSubmit={login} className="border-2 border-black m-auto mt-16 flex flex-col gap-3 py-10 rounded-lg w-[384px] md:w-[600px]">
          <div className="text-center text-4xl cursor-pointer">Login Form</div>
          <div className="text-center text-xl cursor-pointer">{msg}</div>
          <div className="flex justify-center">
            <input type="text" value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value.toLowerCase())} placeholder="email" />
          </div>
          <div className="flex justify-center">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          </div>
          <div className="flex justify-center">
            <Link href="/register">
              <div className="link">Create Account?</div>
            </Link>
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
      const { token } = await verifyToken(context.req.cookies.refreshToken, false);
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
