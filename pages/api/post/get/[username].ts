import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { username, limit = 5, skip = 0 } = req.query;
    try {
      const posts = await PostModel.find({ author: username }).skip(Number(skip)).limit(Number(limit)).sort({ postedAt: -1 });
      resUtilSuccess(res, { posts });
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
