import Head from "next/head";
import React, { useEffect } from "react";

export default function E500() {
  useEffect(() => {
    setTimeout(() => {
      window.location.pathname = "/";
    }, 3333);
  }, []);

  return (
    <>
      <Head>
        <title>500</title>
      </Head>
      <div>
        <div className="flex justify-center mt-[50vh] -translate-y-[50%] font-mono">
          <div className="flex flex-col items-center">
            <div className="text-6xl ">500</div>
            <div className="text-2xl">Server ERror</div>
          </div>
        </div>
      </div>
    </>
  );
}
