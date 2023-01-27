import { model, Schema } from "mongoose";

export interface PostInterface {
  _id?: string;
  image?: string;
  title?: string;
  body?: string;
  author?: string;
  replys?: [];
  postedAt?: number;
}

const PostSchema = new Schema<PostInterface>({
  image: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  replys: {
    type: [],
    default: [],
  },
  postedAt: {
    type: Number,
    default: () => new Date().getTime(),
    immutable: true,
  },
});

const PostModel = model<PostInterface>("post", PostSchema);

export default PostModel;
