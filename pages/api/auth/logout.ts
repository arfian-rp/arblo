import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";
import { Token } from "../../../utils/token";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { refreshToken } = req.cookies;
    try {
      const user: Token = JSON.parse(JSON.stringify(await jwt.verify(refreshToken, process.env.REFRESH_TOKEN!)));
      try {
        if (!refreshToken) return res.status(400).json({ status: 400 });
        UserModel.updateOne({ username: user.username }, { refreshToken: "" })
          .then(() => {
            res.setHeader("Set-Cookie", "refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
            res.status(200).json({ status: 200 });
          })
          .catch(() => res.status(400).json({ status: 400 }));
      } catch (e) {
        res.status(400).json({ status: 400 });
      }
    } catch (e) {
      res.status(400).json({ status: 400 });
    }
  } else res.status(400).json({ status: 400 });
}
