import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import connectDb from "../../../../utils/connectDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { limit = 5, skip = 0 } = req.query;
    try {
      const posts = await PostModel.find().skip(Number(skip)).limit(Number(limit)).sort({ postedAt: -1 });
      res.status(200).json({ posts });
    } catch (e) {
      res.status(400).json({ status: 400 });
    }
  } else res.status(400).json({ status: 400 });
}
