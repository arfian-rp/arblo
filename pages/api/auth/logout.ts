import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../utils/resUtil";
import verifyToken from "../../../utils/verifyToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    try {
      const { userToken } = await verifyToken(req.cookies.refreshToken);
      try {
        if (!req.cookies.refreshToken) return resUtilError(res);
        UserModel.updateOne({ _id: userToken._id }, { refreshToken: "" })
          .then(() => {
            res.setHeader("Set-Cookie", "refreshToken=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
            resUtilSuccess(res);
          })
          .catch(() => resUtilError(res));
      } catch (error) {
        resUtilError(res, { error });
      }
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
