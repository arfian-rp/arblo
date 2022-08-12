import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../../model/UserModel";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";
import verifyToken from "../../../../utils/verifyToken";
import { v2 as cloudinary } from "cloudinary";
import PostModel from "../../../../model/PostModel";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: String(process.env.CLOUD_NAME!),
  api_key: String(process.env.API_KEY!),
  api_secret: String(process.env.API_SECRET!),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      connectDb();
      const { token } = await verifyToken(req.cookies.refreshToken, false);
      const form = formidable({ keepExtensions: true });
      form.parse(req, (err, fields, files: any) => {
        if (err) {
          return resUtilError(res);
        }

        cloudinary.uploader.upload(files.file.filepath, { width: 600 }, async (err: any, res2: any) => {
          await new PostModel({
            title: fields.title,
            body: fields.body,
            image: res2.public_id,
            author: token.username,
          })
            .save()
            .then(() => {
              UserModel.updateOne({ username: token.username }, { $inc: { numberOfPosts: 1 } }).then(() => resUtilSuccess(res));
            })
            .catch(() => resUtilError(res));
        });
      });
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
