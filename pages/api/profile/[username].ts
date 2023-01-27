import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../utils/resUtil";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    connectDb();
    const { username } = req.query;
    try {
      const user = await UserModel.findOne({ username });
      resUtilSuccess(res, { image: user?.image });
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
