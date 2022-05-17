import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";
import jwt from "jsonwebtoken";
import { setCookie } from "../../../utils/cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { username } = req.body;
    const token = JSON.parse(JSON.stringify(await jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN!)));
    if (token) {
      try {
        const refreshToken = await jwt.sign({ _id: token?._id, username }, process.env.REFRESH_TOKEN!, { expiresIn: "12h" });
        UserModel.updateOne(
          { username },
          {
            refreshToken,
          }
        )
          .then(() => {
            setCookie(res, "refreshToken", refreshToken, {
              httpOnly: true,
              maxAge: 12 * 60 * 60 * 1000,
              path: "/",
            });
            res.status(200).json({ status: 200 });
          })
          .catch(() => res.status(400).json({ status: 400 }));
      } catch (error) {
        res.status(400).json({ status: 400 });
      }
    } else res.status(400).json({ status: 400 });
  } else res.status(400).json({ status: 400 });
}
