import jwt from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import UserModel, { UserInterface } from "../../model/UserModel";
import connectDb from "../../utils/connectDb";
import req, { ReqParamInterface } from "../../utils/req";

interface Props {
  user: UserInterface;
}
export default function Edit({ user }: Props) {
  const [file, setFile] = useState<File>();
  const [msg, setMsg] = useState("");
  const [username] = useState(user.username);
  const [img, setImg] = useState("");

  useEffect(() => {
    const param: ReqParamInterface = {
      url: `/api/profile/${username}`,
      method: "get",
      result: ({ image: img }) => {
        setImg(img);
      },
    };
    req(param);
  }, []);


  async function edit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    if (file?.name) {
      formData.append("file", file);
    }

    const param: ReqParamInterface = {
      url: "/api/auth/edit",
      method: "post",
      data: formData,
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
        <form onSubmit={edit} className="border-2 border-black m-auto mt-16 flex flex-col gap-3 py-10 rounded-lg w-[350px] md:w-[600px]">
          <div className="text-center text-4xl cursor-pointer">Edit Photo</div>
          <div className="text-center text-xl cursor-pointer">{msg}</div>
          <div className="flex justify-center">
            <input type="file" onChange={(e) => setFile(e.target.files![0])} accept="image/*" name="file" />
          </div>
          <div className="text-lg mx-auto rounded-lg my-1 w-[350px] md:w-[600px] border-2 border-primary hover:border-black">
          {img ? (
          <div className="mx-auto">
            <img className="border-2 hover:border-black w-[350px] md:w-[600px]" src={`https://res.cloudinary.com/arblo/image/upload/c_fill,w_600/${img}`} alt={`${username}'s profile`} />
          </div>
        ) : (
          <></>
        )}
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
