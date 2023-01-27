import { model, Schema } from "mongoose";

export interface UserInterface {
  _id?: string;
  image?: string;
  username?: string;
  email?: string;
  web?: string;
  bio?: string;
  numberOfPosts?: number;
  refreshToken?: string;
  password?: string;
  lock?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

const UserSchema = new Schema<UserInterface>({
  image: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  web: {
    type: String,
  },
  bio: {
    type: String,
    default: "",
    maxlength: 150,
  },
  numberOfPosts: {
    type: Number,
    default: 0,
  },
  refreshToken: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
  lock: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Number,
    default: () => new Date().getTime(),
    required: true,
    immutable: true,
  },
  updatedAt: {
    type: Number,
    default: () => new Date().getTime(),
    required: true,
  },
});

const UserModel = model<UserInterface>("user", UserSchema);

export default UserModel;
