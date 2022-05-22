import { NextApiResponse } from "next";

export function resUtilError(res: NextApiResponse, message: any = {}, status: number = 400) {
  res.status(status).json({ status, message });
}
export function resUtilSuccess(res: NextApiResponse, message: any = {}, status: number = 200) {
  message.status = status;
  res.status(status).json(message);
}
