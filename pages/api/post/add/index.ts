import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import UserModel from "../../../../model/UserModel";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";
import verifyToken from "../../../../utils/verifyToken";
import { v2 as cloudinary } from "cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      connectDb();
      const { token } = await verifyToken(req.cookies.refreshToken, false);
      UserModel.updateOne({ username: token.username }, { $inc: { numberOfPosts: 1 } })
        .then(() => {
          const form = formidable({ multiples: true, keepExtensions: true });
          form.parse(req, (err, fields: any, files: any) => {
            res.status(200).json(fields);
            cloudinary.uploader
              .upload(files.file.path, { width: 600 }, (err: any, res2: any) => {
                new PostModel({
                  title: fields.title,
                  body: fields.body,
                  image: res2.public_id,
                  author: token.username,
                }).save();
              })
              .then(() => resUtilSuccess(res))
              .catch(() => resUtilError(res));
          });
        })
        .catch(() => resUtilError(res));
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
