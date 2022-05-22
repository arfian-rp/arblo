import jwt from "jsonwebtoken";
import UserModel from "../model/UserModel";

export default async function verifyToken(token: string, getUserToken: boolean = true) {
  const t = JSON.parse(JSON.stringify(await jwt.verify(token, process.env.REFRESH_TOKEN!)));
  let userToken;
  if (getUserToken) {
    userToken = JSON.parse(JSON.stringify(await UserModel.findOne({ username: t.username }).select(["username", "_id"])));
  }
  return { userToken, token: t };
}
