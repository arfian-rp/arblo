import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../../model/PostModel";
import connectDb from "../../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../../utils/resUtil";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { _id } = req.query;
    try {
      const post = await PostModel.findById(_id);
      resUtilSuccess(res, { post });
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
