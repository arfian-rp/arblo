import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../../model/UserModel";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";
import verifyToken from "../../../../utils/verifyToken";
import PostModel from "../../../../model/PostModel";
import cloudinary from "../../../../utils/cloudinary";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      connectDb();
      const { token } = await verifyToken(req.cookies.refreshToken, false);
      new PostModel({
        title: req.body.title,
        body: req.body.body,
        image: "",
        author: token.username,
      })
        .save()
        .then(() => {
          UserModel.updateOne({ username: token.username }, { $inc: { numberOfPosts: 1 } }).then(() => resUtilSuccess(res));
        })
        .catch(() => resUtilError(res));
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
