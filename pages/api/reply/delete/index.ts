import { NextApiRequest, NextApiResponse } from "next";
import PostModel from "../../../../model/PostModel";
import connectDb from "../../../../utils/connectDb";
import { resUtilError, resUtilSuccess } from "../../../../utils/resUtil";
import verifyToken from "../../../../utils/verifyToken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    connectDb();
    const { _id, _idPost } = req.body;
    try {
      const { userToken } = await verifyToken(req.cookies.refreshToken);
      if (userToken) {
        PostModel.updateOne(
          { _id: _idPost },
          {
            $pull: {
              replys: {
                _id,
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
