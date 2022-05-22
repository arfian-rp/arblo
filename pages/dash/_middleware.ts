import { NextRequest, NextResponse } from "next/server";
import connectDb from "../../utils/connectDb";
import verifyToken from "../../utils/verifyToken";

export default async function middleware(req: NextRequest) {
  connectDb();
  const { userToken } = await verifyToken(req.cookies.refreshToken);
  if (userToken) {
    return NextResponse.redirect("/");
  }
}
