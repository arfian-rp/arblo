import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import connectDb from "../../../../utils/connectDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      connectDb();
      const { _idPost, body } = req.body;
      const token = JSON.parse(JSON.stringify(await jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN!)));
      PostModel.updateOne(
        { _id: _idPost },
        {
          $push: {
            replys: {
              _id: String(new Date().getTime()),
              body,
              author: token.username,
            },
          },
        }
      )
        .then(() => res.status(200).json({ status: 200 }))
        .catch(() => res.status(400).json({ status: 400 }));
    } catch (e) {
      res.status(400).json({ status: 400 });
    }
  } else res.status(400).json({ status: 400 });
}
