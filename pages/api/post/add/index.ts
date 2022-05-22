import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import UserModel from "../../../../model/UserModel";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";
import verifyToken from "../../../../utils/verifyToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      connectDb();
      const { token } = await verifyToken(req.cookies.refreshToken, false);
      UserModel.updateOne({ username: token.username }, { $inc: { numberOfPosts: 1 } })
        .then(() => {
          const { title, body } = req.body;
          new PostModel({
            title,
            body,
            author: token.username,
          })
            .save()
            .then(() => resUtilSuccess(res))
            .catch(() => resUtilError(res));
        })
        .catch(() => resUtilError(res));
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
