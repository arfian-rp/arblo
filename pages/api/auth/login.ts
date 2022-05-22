import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";
import { setCookie } from "../../../utils/cookie";
import { resUtilError, resUtilSuccess } from "../../../utils/resUtil";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { usernameOrEmail, password } = req.body;
    try {
      const user = JSON.parse(
        JSON.stringify(
          await UserModel.findOne({
            $or: [{ username: usernameOrEmail.toLowerCase() }, { email: usernameOrEmail.toLowerCase() }],
          }).select(["_id", "username", "password"])
        )
      );
      if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          const refreshToken = await jwt.sign({ _id: user._id, username: user.username }, process.env.REFRESH_TOKEN!, { expiresIn: "12h" });
          UserModel.updateOne(
            { username: user?.username },
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
        } else resUtilError(res);
      } else resUtilError(res);
    } catch (error) {
      resUtilError(res, { error });
    }
  } else resUtilError(res);
}
