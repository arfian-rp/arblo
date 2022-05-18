import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import Layout from "../components/Layout";
import req, { ReqParamInterface } from "../utils/req";
import jwt from "jsonwebtoken";

export default function Register() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const param: ReqParamInterface = {
      url: "/api/auth/register",
      method: "post",
      data: {
        username,
        email,
        password,
        confirm,
      },
      loading: () => setMsg("Loading..."),
      result: () => {
        setMsg("Success...");
        router.push("/login");
      },
      error: () => setMsg("Error..."),
    };
    req(param);
  }

  return (
    <Layout title="Register" description="register page" isAuth={false}>
      <div>
        <form onSubmit={register} className="flex flex-col gap-2 p-5 md:w-[33vw] border-2 border-primary mx-auto mt-[50vh] -translate-y-[75%] rounded-md">
          <div className="text-center text-3xl">Register</div>
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
            <label htmlFor="password">Password:</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="input" type="password" id="password" placeholder="min 8 characters" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="confirm">Confirm:</label>
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" type="password" id="confirm" placeholder="repeat password" />
          </div>
          <div>
            <Link href="/login">
              <div className="link">Login?</div>
            </Link>
          </div>
          <div>
            <button className="btn" type="submit">
              Register
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
