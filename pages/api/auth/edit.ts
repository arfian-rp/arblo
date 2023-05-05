import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import cloudinary from "../../../utils/cloudinary";
import connectDb from "../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../utils/resUtil";
import verifyToken from "../../../utils/verifyToken";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { token } = await verifyToken(req.cookies.refreshToken, false);

    const form = formidable({ keepExtensions: true, multiples: true, allowEmptyFiles: true });
    form.parse(req, (err, fields, files: any) => {
      if (err) {
        return resUtilError(res);
      }

      if (files.file) {
        cloudinary.uploader.upload(files.file.filepath, { width: 100 }, (err: any, res2: any) => {
          if (err) {
            return console.info(err);
          }
          if (token) {
            UserModel.updateOne(
              { username: token.username },
              {
                image: res2.public_id,
                email: fields.email,
                web: fields.web,
                bio: fields.bio,
                updatedAt: new Date().getTime(),
              }
            )
              .then(() => resUtilSuccess(res))
              .catch(() => resUtilError(res));
          }
        });
      }else{
        if (token) {
          UserModel.updateOne(
            { username: token.username },
            {
              email: fields.email,
              web: fields.web,
              bio: fields.bio,
              updatedAt: new Date().getTime(),
            }
          )
            .then(() => resUtilSuccess(res))
            .catch(() => resUtilError(res));
        }
      }
    });
  } else resUtilError(res);
}
