import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import UserModel from "../../../../model/UserModel";
import cloudinary from "../../../../utils/cloudinary";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";
import verifyToken from "../../../../utils/verifyToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    connectDb();
    const { _id, image } = req.body;
    try {
      const { token } = await verifyToken(req.cookies.refreshToken, false);
      PostModel.deleteOne({ _id })
        .then(() => {
          UserModel.updateOne({ username: token.username }, { $inc: { numberOfPosts: -1 } })
            .then(() => {
              cloudinary.uploader.destroy(image, {}, () => resUtilSuccess(res));
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
