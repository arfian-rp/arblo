import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import Layout from "../components/Layout";
import req, { ReqParamInterface } from "../utils/req";
import verifyToken from "../utils/verifyToken";

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
        <form onSubmit={register} className="border-2 border-black m-auto mt-16 flex flex-col gap-3 py-10 rounded-lg w-[350px] md:w-[600px]">
          <div className="text-center text-4xl cursor-pointer">Register Form</div>
          <div className="text-center text-xl cursor-pointer">{msg}</div>
          <div className="flex justify-center">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} placeholder="username" />
          </div>
          <div className="flex justify-center">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} placeholder="email" />
          </div>
          <div className="flex justify-center">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          </div>
          <div className="flex justify-center">
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="confirm password" />
          </div>
          <div className="flex justify-center">
            <Link href="/login">
              <div className="link">Login?</div>
            </Link>
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
