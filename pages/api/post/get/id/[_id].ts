import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../../model/PostModel";
import connectDb from "../../../../../utils/connectDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { _id } = req.query;
    try {
      const post = await PostModel.findById(_id);
      res.status(200).json({ post });
    } catch (e) {
      res.status(400).json({ status: 400 });
    }
  } else res.status(400).json({ status: 400 });
}
