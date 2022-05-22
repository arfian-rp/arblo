import { serialize, CookieSerializeOptions } from "cookie";
import { NextApiResponse } from "next";

export function setCookie(res: NextApiResponse, name: string, value: string, options: CookieSerializeOptions = {}) {
  if ("maxAge" in options) {
    options.expires = new Date(Date.now() + options.maxAge!);
    options.maxAge! /= 1000;
  }

  res.setHeader("Set-Cookie", serialize(name, value, options));
}
