import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";
import verifyToken from "../../../../utils/verifyToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      connectDb();
      const { _idPost, body } = req.body;
      const { userToken } = await verifyToken(req.cookies.refreshToken);
      if (userToken) {
        PostModel.updateOne(
          { _id: _idPost },
          {
            $push: {
              replys: {
                _id: String(new Date().getTime()),
                body,
                author: userToken.username,
              },
            },
          }
        )
          .then(() => resUtilSuccess(res))
          .catch(() => resUtilError(res));
      } else resUtilError(res);
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
