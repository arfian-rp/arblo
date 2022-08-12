import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../../model/UserModel";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";
import verifyToken from "../../../../utils/verifyToken";
import PostModel from "../../../../model/PostModel";
import cloudinary from "../../../../utils/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

        if (files.file) {
          cloudinary.uploader.upload(files.file.filepath, { width: 600 }, (err: any, res2: any) => {
            if (err) {
              return console.info(err);
            }
            new PostModel({
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
        } else {
          new PostModel({
            title: fields.title,
            body: fields.body,
            image: "",
            author: token.username,
          })
            .save()
            .then(() => {
              UserModel.updateOne({ username: token.username }, { $inc: { numberOfPosts: 1 } }).then(() => resUtilSuccess(res));
            })
            .catch(() => resUtilError(res));
        }
      });
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
