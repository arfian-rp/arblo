import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { username, email, bio } = req.body;
    try {
      const token = JSON.parse(JSON.stringify(await jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN!)));
      if (token) {
        UserModel.updateOne(
          { username: token.username },
          {
            username,
            email,
            bio,
            updatedAt: new Date().getTime(),
          }
        )
          .then(() => res.status(200).json({ status: 200 }))
          .catch(() => res.status(400).json({ status: 400 }));
      }
    } catch (e) {
      res.status(400).json({ status: 400 });
    }
  } else res.status(400).json({ status: 400 });
}
