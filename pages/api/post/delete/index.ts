import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import UserModel from "../../../../model/UserModel";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";
import verifyToken from "../../../../utils/verifyToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    connectDb();
    const { _id } = req.body;
    try {
      const { token } = await verifyToken(req.cookies.refreshToken, false);
      UserModel.updateOne({ username: token.username }, { $inc: { numberOfPosts: -1 } })
        .then(() => {
          PostModel.deleteOne({ _id })
            .then(() => {
              resUtilSuccess(res);
            })
            .catch(() => resUtilError(res));
        })
        .catch(() => resUtilError(res));
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
