import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "../../../model/UserModel";
import connectDb from "../../../utils/connectDb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    connectDb();
    const { username, email, password, confirm } = req.body;
    if (password.length >= 8) {
      if (password === confirm) {
        const hash = await bcrypt.hash(password, 10);
        new UserModel({ username: username.toLowerCase(), email: email.toLowerCase(), password: hash })
          .save()
          .then(() => {
            res.status(200).json({ status: 200 });
          })
          .catch(() => res.status(400).json({ status: 400 }));
      } else res.status(400).json({ status: 400 });
    } else res.status(400).json({ status: 400 });
  } else res.status(400).json({ status: 400 });
}
