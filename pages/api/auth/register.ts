import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../utils/resUtil";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { username, email, password, confirm } = req.body;
    if (password.length >= 8 && password === confirm) {
      const hash = await bcrypt.hash(password, 10);
      new UserModel({ username: username.toLowerCase(), email: email.toLowerCase(), password: hash, web: "" })
        .save()
        .then(() => {
          resUtilSuccess(res);
        })
        .catch(() => resUtilError(res));
    } else resUtilError(res);
  } else resUtilError(res);
}
