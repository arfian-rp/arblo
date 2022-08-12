import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../utils/resUtil";
import verifyToken from "../../../utils/verifyToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { username, email, web, bio } = req.body;
    try {
      const { token } = await verifyToken(req.cookies.refreshToken, false);
      if (token) {
        UserModel.updateOne(
          { username: token.username },
          {
            username,
            email,
            web,
            bio,
            updatedAt: new Date().getTime(),
          }
        )
          .then(() => resUtilSuccess(res))
          .catch(() => resUtilError(res));
      }
    } catch (e) {
      resUtilError(res);
    }
  } else resUtilError(res);
}
