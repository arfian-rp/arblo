import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import UserModel from "../../../../model/UserModel";
import connectDb from "../../../../utils/connectDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      connectDb();
      const token = JSON.parse(JSON.stringify(await jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN!)));
      UserModel.updateOne({ username: token.username }, { $inc: { numberOfPosts: 1 } })
        .then(() => {
          const { title, body } = req.body;
          new PostModel({
            title,
            body,
            author: token.username,
          })
            .save()
            .then(() => res.status(200).json({ status: 200 }))
            .catch(() => res.status(400).json({ status: 400 }));
        })
        .catch(() => res.status(400).json({ status: 400 }));
    } catch (e) {
      res.status(400).json({ status: 400 });
    }
  } else res.status(400).json({ status: 400 });
}
