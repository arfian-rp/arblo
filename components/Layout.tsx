import Head from "next/head";
import React, { ReactNode } from "react";
import Navbar from "./Navbar";

interface Props {
  title?: string;
  children: ReactNode;
  isAuth: boolean;
  username?: string;
}
export default function Layout(props: Props) {
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Navbar isAuth={props.isAuth} username={props?.username} />
      <div className="font-mono">{props.children}</div>
    </>
  );
}
