import Head from "next/head";
import React, { ReactNode } from "react";
import Navbar from "./Navbar";

interface Props {
  title?: string;
  children: ReactNode;
  description?: string;
  isAuth: boolean;
  username?: string;
}
export default function Layout({ title, children, username, isAuth, description = "article blog" }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta name="keywords" content="arblo, article, blog, article blog, blog article, arfian blogm arfian article" />
        <meta name="author" content="arfian pradana" />
      </Head>
      <Navbar isAuth={isAuth} username={username} />
      <div className="font-mono">{children}</div>
    </>
  );
}
