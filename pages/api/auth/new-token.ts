import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";
import jwt from "jsonwebtoken";
import { setCookie } from "../../../utils/cookie";
import verifyToken from "../../../utils/verifyToken";
import { resUtilError, resUtilSuccess } from "../../../utils/resUtil";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { username } = req.body;
    const { token } = await verifyToken(req.cookies.refreshToken, false);
    if (token) {
      try {
        const refreshToken = await jwt.sign({ _id: token?._id, username }, process.env.REFRESH_TOKEN!, { expiresIn: "12h" });
        UserModel.updateOne(
          { username },
          {
            refreshToken,
          }
        )
          .then(() => {
            setCookie(res, "refreshToken", refreshToken, {
              httpOnly: true,
              maxAge: 12 * 60 * 60 * 1000,
              path: "/",
            });
            resUtilSuccess(res);
          })
          .catch(() => resUtilError(res));
      } catch (error) {
        resUtilError(res, { error });
      }
    } else resUtilError(res);
  } else resUtilError(res);
}
