import { model, Schema } from "mongoose";

const usersSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Users = model("Users", usersSchema);

export default Users;
